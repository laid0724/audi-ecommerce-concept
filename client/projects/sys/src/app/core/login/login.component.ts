import { OnDestroy } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import {
  AccountService,
  User,
  Roles,
  initAudiModules,
  AudiModuleName,
  hasSameValueValidator,
} from '@audi/data';
import { ClrForm, ClrLoadingState } from '@clr/angular';
import { ToastrService } from 'ngx-toastr';
import { of, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'audi-sys-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('loginClrForm', { read: ClrForm }) loginClrForm: ClrForm;
  @ViewChild('resetPwClrForm', { read: ClrForm }) resetPwClrForm: ClrForm;

  loginForm: FormGroup;
  loginBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  resetPwForm: FormGroup;
  resetPwModalOpen: boolean = false;
  resetPwBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  destroy$ = new Subject<boolean>();

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
    this.initResetPwForm();
    initAudiModules(AudiModuleName.Response).forEach((module) =>
      module.components?.upgradeElements()
    );

    this.route.data
      .pipe(
        tap((data: Data) => {
          if (!data.confirmEmail && !data.resetPassword) {
            this.setUserFromLocalStorage();
          }
        }),
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
                    tap(() => {
                      this.toastr.success('Email verified', '信箱認證成功');
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

  submitResetPw(): void {
    if (this.resetPwForm.invalid) {
      this.resetPwClrForm.markAsTouched();
      this.resetPwForm.markAllAsTouched();
      return;
    }

    this.resetPwBtnState = ClrLoadingState.LOADING;

    this.accountService
      .resetUserPassword(this.resetPwForm.value)
      .pipe(take(1))
      .subscribe(
        (user: User | null) => {
          this.resetPwBtnState = ClrLoadingState.DEFAULT;
          this.resetPwModalOpen = false;
          this.toastr.success('Password reset successfully', '密碼重置成功');
        },
        (error) => {
          this.resetPwBtnState = ClrLoadingState.ERROR;
        }
      );
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginClrForm.markAsTouched();
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginBtnState = ClrLoadingState.LOADING;

    this.accountService
      .login(this.loginForm.value)
      .pipe(switchMap((user: User) => this.accountService.currentUser$))
      .subscribe(
        (user: User | null) => {
          if (user != null) {
            this.directUserBasedOnRole(this.userHasRightRole(user));
          } else {
            this.loginBtnState = ClrLoadingState.DEFAULT;
          }
        },
        (error) => {
          this.loginBtnState = ClrLoadingState.ERROR;
        }
      );
  }

  setUserFromLocalStorage(): void {
    const localStorageUserData = localStorage.getItem('user');

    if (localStorageUserData != null) {
      const user: User = JSON.parse(localStorageUserData);
      this.accountService.setCurrentUser(user);

      this.accountService.currentUser$
        .pipe(takeUntil(this.destroy$))
        .subscribe((user: User | null) => {
          if (user != null) {
            this.directUserBasedOnRole(this.userHasRightRole(user));
          }
        });
    }
  }

  userHasRightRole(user: User): boolean {
    const isAdminOrModerator =
      user.roles.includes(Roles.Admin) || user.roles.includes(Roles.Moderator);
    return isAdminOrModerator;
  }

  routeToHome(): void {
    this.router.navigateByUrl('/manage/home');
  }

  directUserBasedOnRole(isRightRole: boolean): void {
    if (!isRightRole) {
      this.loginBtnState = ClrLoadingState.ERROR;
      this.toastr.error('你不是管理員 You are not an admin');
      this.accountService.logout();
    } else {
      this.loginBtnState = ClrLoadingState.SUCCESS;
      this.routeToHome();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
