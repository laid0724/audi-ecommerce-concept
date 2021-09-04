import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import {
  AccountService,
  hasSameValueValidator,
  LanguageCode,
  LanguageStateService,
  Roles,
  User,
} from '@audi/data';
import { TranslocoService } from '@ngneat/transloco';
import { of, Subject } from 'rxjs';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { NotificationService } from '../../component-modules/audi-ui/services/notification-service/notification.service';

// TODO: RFX this and break apart into smaller component with single responsibility

@Component({
  selector: 'audi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  @HostListener('document:keydown.escape', ['$event']) onEscapeHandler(
    event: KeyboardEvent
  ) {
    if (this.resetPwModalOpen) {
      this.closeResetPwModal();
    }

    if (this.forgotPwModalOpen) {
      this.closeForgotPwModal();
    }
  }

  @HostListener('document:keydown.enter', ['$event']) onEnterHandler(
    event: KeyboardEvent
  ) {
    if (this.resetPwModalOpen) {
      this.submitResetPw();
    }

    if (this.forgotPwModalOpen) {
      this.submitForgotPw();
    }

    if (!this.resetPwModalOpen && !this.forgotPwModalOpen) {
      if (this.currentMode === 'login') {
        this.login();
      }

      if (this.currentMode === 'register') {
        this.register();
      }
    }
  }

  currentMode: 'login' | 'register' = 'login';

  loginForm: FormGroup;
  registerForm: FormGroup;
  resetPwForm: FormGroup;
  forgotPwForm: FormGroup;

  resetPwModalOpen: boolean = false;
  forgotPwModalOpen: boolean = false;

  emailNotFoundError: boolean = false;

  currentLanguage: LanguageCode = this.languageService.getCurrentLanguage();

  urlToRedirectAfterLogin: string | undefined;

  destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private languageService: LanguageStateService,
    private accountService: AccountService,
    private notificationService: NotificationService,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
    this.initRegisterForm();
    this.initResetPwForm();
    this.initForgotPwForm();

    this.urlToRedirectAfterLogin = this.route.snapshot.queryParams?.redirectTo;
  }

  ngAfterViewInit(): void {
    this.route.data
      .pipe(
        filter((data: Data) => data.confirmEmail || data.resetPassword),
        switchMap((data: Data) => {
          if (data.confirmEmail) {
            return this.route.queryParamMap.pipe(
              filter(
                (params: ParamMap) =>
                  params.has('userId') && params.has('token')
              ),
              switchMap((params: ParamMap) =>
                this.accountService
                  .confirmUserEmail({
                    userId: parseInt(params.get('userId') as string),
                    token: params.get('token') as string,
                  })
                  .pipe(
                    take(1),
                    tap((user: User) => {
                      this.transloco
                        .selectTranslate(this.transloco.getActiveLang())
                        .pipe(take(1))
                        .subscribe(() => {
                          this.notificationService.success(
                            this.transloco.translate(
                              'notifications.emailVerified'
                            ),
                            this.transloco.translate('notifications.success')
                          );
                        });

                      if (user != null) {
                        this.accountService.setCurrentUser(user);
                        this.directUserBasedOnRole(this.userHasRightRole(user));
                      }
                    })
                  )
              )
            );
          }
          if (data.resetPassword) {
            return this.route.queryParamMap.pipe(
              filter(
                (params: ParamMap) =>
                  params.has('userId') && params.has('token')
              ),
              tap((params: ParamMap) => {
                this.resetPwForm.patchValue({
                  userId: parseInt(params.get('userId') as string),
                  token: params.get('token') as string,
                });
                this.resetPwModalOpen = true;
              })
            );
          }
          return of(null);
        })
      )
      .subscribe();
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  initRegisterForm(): void {
    this.registerForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          hasSameValueValidator('password'),
        ],
      ],
    });
  }

  initResetPwForm(): void {
    this.resetPwForm = this.fb.group({
      userId: [null, [Validators.required]],
      token: [null, [Validators.required]],
      newPassword: [null, [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          hasSameValueValidator('newPassword'),
        ],
      ],
    });
  }

  initForgotPwForm(): void {
    this.forgotPwForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  userHasRightRole(user: User): boolean {
    const isMember = user.roles.includes(Roles.Member);
    return isMember;
  }

  directUserBasedOnRole(isRightRole: boolean): void {
    if (!isRightRole) {
      this.transloco
        .selectTranslate(this.transloco.getActiveLang())
        .pipe(take(1))
        .subscribe(() => {
          this.notificationService.error(
            this.transloco.translate('notifications.notMemberError'),
            this.transloco.translate('notifications.error'),
            3000
          );
        });
      this.accountService.logoutWithoutRedirect();
      return;
    }

    this.routeToPreviousPage();
  }

  routeToPreviousPage(): void {
    if (this.urlToRedirectAfterLogin != undefined) {
      // this way you dont need to break the url apart when there are query params
      // see: https://stackoverflow.com/questions/52980345/router-navigate-with-query-params-angular-5
      this.router.navigateByUrl(this.urlToRedirectAfterLogin);
    } else {
      this.router.navigate([
        '/',
        this.languageService.getCurrentLanguage(),
        'home',
      ]);
    }
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.accountService
      .login(this.loginForm.value)
      .pipe(
        switchMap((user: User) => this.accountService.currentUser$),
        take(1)
      )
      .subscribe((user: User | null) => {
        if (user != null) {
          this.directUserBasedOnRole(this.userHasRightRole(user));
        }
      });
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.accountService
      .register(this.registerForm.value)
      .pipe(take(1))
      .subscribe((user: User) => {
        if (user) {
          this.registerForm.reset();
          this.notificationService.success(
            this.transloco.translate('notifications.registerSuccessMessage'),
            this.transloco.translate('notifications.registerSuccess')
          );
        }
      });
  }

  submitResetPw(): void {
    if (this.resetPwForm.invalid) {
      this.resetPwForm.markAllAsTouched();
      return;
    }

    this.accountService
      .resetUserPassword(this.resetPwForm.value)
      .pipe(take(1))
      .subscribe((user: User | null) => {
        this.resetPwModalOpen = false;
        this.resetPwForm.reset();
        this.notificationService.success(
          this.transloco.translate('notifications.passwordResetSuccess'),
          this.transloco.translate('notifications.success'),
          3000
        );
      });
  }

  submitForgotPw(): void {
    this.emailNotFoundError = false;

    if (this.forgotPwForm.invalid) {
      this.forgotPwForm.markAllAsTouched();
      return;
    }

    this.accountService
      .forgotPassword(this.forgotPwForm.value)
      .pipe(take(1))
      .subscribe(
        (res: null) => {
          this.forgotPwModalOpen = false;
          this.forgotPwForm.reset();
          this.notificationService.success(
            this.transloco.translate('notifications.forgotPasswordSuccess'),
            this.transloco.translate('notifications.success'),
            3000
          );
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.emailNotFoundError = true;
          }
        }
      );
  }

  closeResetPwModal(): void {
    this.resetPwForm.reset();
    this.resetPwModalOpen = false;
  }

  closeForgotPwModal(): void {
    this.forgotPwForm.reset();
    this.forgotPwModalOpen = false;
    this.emailNotFoundError = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
