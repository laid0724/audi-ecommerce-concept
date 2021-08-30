import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccountService,
  LanguageCode,
  LanguageStateService,
  Roles,
  User,
} from '@audi/data';
import { TranslocoService } from '@ngneat/transloco';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ModalService } from '../../component-modules/audi-ui/services/modal-service/modal.service';
import { NotificationService } from '../../component-modules/audi-ui/services/notification-service/notification.service';

@Component({
  selector: 'audi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  currentMode: 'login' | 'register' = 'login';

  loginForm: FormGroup;

  currentLanguage: LanguageCode = this.languageService.getCurrentLanguage();

  urlToRedirectAfterLogin: string | undefined;

  destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private languageService: LanguageStateService,
    private accountService: AccountService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    this.initLoginForm();

    this.urlToRedirectAfterLogin = this.route.snapshot.queryParams?.redirectTo;
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  userHasRightRole(user: User): boolean {
    const isMember = user.roles.includes(Roles.Member);
    return isMember;
  }

  directUserBasedOnRole(isRightRole: boolean): void {
    if (!isRightRole) {
      this.notificationService.error(
        this.transloco.translate('errorMessages.notMember'),
        // TODO: transloco title
        'Error',
        3000
      );
      this.accountService.logoutWithoutRedirect();
      return;
    }

    this.routeToPreviousPage();
  }

  routeToPreviousPage(): void {
    if (this.urlToRedirectAfterLogin != undefined) {
      this.router.navigate([this.urlToRedirectAfterLogin]);
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
      .pipe(switchMap((user: User) => this.accountService.currentUser$))
      .subscribe((user: User | null) => {
        if (user != null) {
          this.directUserBasedOnRole(this.userHasRightRole(user));
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
