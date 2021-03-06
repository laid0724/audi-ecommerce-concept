import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AccountService,
  BusyService,
  hasSameValueValidator,
  PHONE_NUMBER_REGEX,
  SensitiveUserData,
  User,
} from '@audi/data';
import { ClrForm, ClrLoadingState } from '@clr/angular';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'projects/public/src/environments/environment';
import { Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'audi-sys-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  @ViewChild('changePwClrForm', { read: ClrForm }) changePwClrForm: ClrForm;
  @ViewChild('changePersonalInfoClrForm', { read: ClrForm })
  changePersonalInfoClrForm: ClrForm;

  user: User | null;

  isProduction: boolean = environment.production;

  changePwForm: FormGroup;
  changePwModalOpen: boolean = false;
  changePwBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  changePersonalInfoForm: FormGroup;
  changePersonalInfoModalOpen: boolean = false;
  changePersonalInfoBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  destroy$ = new Subject<boolean>();

  get isMasterAdmin(): boolean {
    if (this.user !== null) {
      return this.user.email === 'admin@audi.com.tw';
    }
    return false;
  }

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private busyService: BusyService
  ) {}

  ngOnInit(): void {
    this.initChangePwForm();
    this.initChangePersonalInfoForm();

    this.accountService.currentUser$
      .pipe(
        tap((user: User | null) => {
          this.user = user;
        }),
        filter((user: User | null) => user !== null),
        switchMap((user: User | null) =>
          this.accountService.getUserPersonalInfo()
        ),
        tap((moderatorInfo: SensitiveUserData) => {
          this.changePersonalInfoForm.patchValue(moderatorInfo);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.busyService.idle());
  }

  initChangePwForm(): void {
    this.changePwForm = this.fb.group({
      currentPassword: [null, [Validators.required, Validators.minLength(8)]],
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

  submitChangePw(): void {
    if (this.changePwForm.invalid) {
      this.changePwClrForm.markAsTouched();
      this.changePwForm.markAllAsTouched();
      return;
    }

    if (this.user !== null) {
      this.changePwBtnState = ClrLoadingState.LOADING;

      this.accountService
        .changeUserPassword({
          userId: this.user.id,
          ...this.changePwForm.value,
        })
        .pipe(take(1))
        .subscribe(
          (user: User | null) => {
            this.changePwBtnState = ClrLoadingState.DEFAULT;
            this.changePwModalOpen = false;
            this.toastr.success(
              'Password changed successfully',
              '??????????????????'
            );
          },
          (error) => {
            this.changePwBtnState = ClrLoadingState.ERROR;
          }
        );
    }
  }

  initChangePersonalInfoForm(): void {
    this.changePersonalInfoForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      phoneNumber: [null, [Validators.pattern(PHONE_NUMBER_REGEX)]],
    });
  }

  submitChangePersonalInfo(): void {
    if (this.changePersonalInfoForm.invalid) {
      this.changePersonalInfoClrForm.markAsTouched();
      this.changePersonalInfoForm.markAllAsTouched();
      return;
    }

    if (this.user !== null) {
      this.changePersonalInfoBtnState = ClrLoadingState.LOADING;

      this.accountService
        .updateUserPersonalInfo({
          userId: this.user.id,
          ...this.changePersonalInfoForm.value,
        })
        .pipe(take(1))
        .subscribe(
          (user: SensitiveUserData) => {
            this.changePersonalInfoBtnState = ClrLoadingState.DEFAULT;
            this.changePersonalInfoModalOpen = false;
            this.toastr.success(
              'Personal info changed successfully',
              '????????????'
            );
          },
          (error) => {
            this.changePersonalInfoBtnState = ClrLoadingState.ERROR;
          }
        );
    }
  }

  logout(): void {
    this.accountService.logout();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
