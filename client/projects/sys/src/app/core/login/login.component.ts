import { OnDestroy } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService, User, Roles } from '@audi/data';
import { ClrForm, ClrLoadingState } from '@clr/angular';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { initAllAudiElements } from '@audi/data';

@Component({
  selector: 'audi-sys-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild(ClrForm, { static: false }) clrForm: ClrForm;

  loginForm: FormGroup;
  loginBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  destroy$ = new Subject<boolean>();

  constructor(
    private router: Router,
    private accountService: AccountService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.initLoginForm();
    initAllAudiElements();
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.clrForm.markAsTouched();
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
