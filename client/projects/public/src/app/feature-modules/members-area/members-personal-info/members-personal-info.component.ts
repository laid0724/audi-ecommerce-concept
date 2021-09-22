import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AccountService,
  BusyService,
  DATE_REGEX,
  formatClrDateToUTCString,
  formatServerTimeToClrDate,
  Gender,
  hasSameValueValidator,
  LanguageCode,
  LanguageStateService,
  PHONE_NUMBER_REGEX,
  SensitiveUserData,
  User,
  NotificationService,
} from '@audi/data';
import { TranslocoService } from '@ngneat/transloco';
import { Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { addressFormGroupBuilder } from '../../../component-modules/address-fg/address-fg.component';

@Component({
  selector: 'audi-members-personal-info',
  templateUrl: './members-personal-info.component.html',
  styleUrls: ['./members-personal-info.component.scss'],
})
export class MembersPersonalInfoComponent implements OnInit, OnDestroy {
  user: User;
  userInfo: SensitiveUserData;

  form: FormGroup;
  changePwForm: FormGroup;

  destroy$ = new Subject<boolean>();

  isDesktop: boolean = true;
  changePwModalOpen: boolean = false;

  get language(): LanguageCode {
    return this.languageService.getCurrentLanguage();
  }

  get genders(): Gender[] {
    return Object.keys(Gender).map(
      (key: string) =>
        // @ts-ignore
        Gender[key]
    );
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    private fb: FormBuilder,
    private accountService: AccountService,
    private languageService: LanguageStateService,
    private busyService: BusyService,
    private transloco: TranslocoService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initChangePwForm();

    this.accountService.currentUser$
      .pipe(
        filter((user: User | null) => user !== null),
        switchMap((user: User | null) => {
          this.user = user as User;

          this.form.get('userId')?.patchValue(this.user.id);
          this.changePwForm.get('userId')?.patchValue(this.user.id);

          return this.accountService.getUserPersonalInfo();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((userInfo: SensitiveUserData) => {
        this.userInfo = userInfo;

        this.form.patchValue({
          ...userInfo,
          address: {
            ...userInfo.address,
            country: this.language === 'zh' ? '台灣' : 'Taiwan',
            state: this.language === 'zh' ? '台灣' : 'Taiwan',
          },
          dateOfBirth:
            userInfo.dateOfBirth.toString() !== '0001-01-01T00:00:00Z'
              ? formatServerTimeToClrDate(userInfo.dateOfBirth as Date)
              : null,
        });
        this.busyService.idle();
      });

    this.breakpointObserver
      .observe(['(min-width: 768px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        this.isDesktop = state.matches;
      });
  }

  initForm(): void {
    this.form = this.fb.group({
      userId: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      gender: [Gender.Other],
      phoneNumber: [
        null,
        [(Validators.required, Validators.pattern(PHONE_NUMBER_REGEX))],
      ],
      dateOfBirth: [null, [Validators.pattern(DATE_REGEX)]],
      address: addressFormGroupBuilder(this.fb, this.language),
    });
  }

  initChangePwForm(): void {
    this.changePwForm = this.fb.group({
      userId: [null, [Validators.required]],
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { dateOfBirth } = this.form.value;

    this.accountService
      .updateUserPersonalInfo({
        ...this.form.value,
        dateOfBirth: formatClrDateToUTCString(dateOfBirth),
      })
      .pipe(take(1))
      .subscribe(() => {
        this.notificationService.success(
          this.transloco.translate('notifications.updateUserInfoSuccess'),
          this.transloco.translate('notifications.success'),
          3000
        );
      });
  }

  onReset(): void {
    this.form.patchValue({
      ...this.userInfo,
      address: {
        ...this.userInfo.address,
        country: this.language === 'zh' ? '台灣' : 'Taiwan',
        state: this.language === 'zh' ? '台灣' : 'Taiwan',
      },
      dateOfBirth:
        this.userInfo.dateOfBirth.toString() !== '0001-01-01T00:00:00Z'
          ? formatServerTimeToClrDate(this.userInfo.dateOfBirth as Date)
          : null,
    });
  }

  onChangePassword(): void {
    if (this.changePwForm.invalid) {
      this.changePwForm.markAllAsTouched();
      return;
    }

    this.accountService
      .changeUserPassword(this.changePwForm.value)
      .pipe(take(1))
      .subscribe(() => {
        this.notificationService.success(
          this.transloco.translate('notifications.passwordChangeSuccess'),
          this.transloco.translate('notifications.success'),
          3000
        );

        this.closeChangePwModal();
      });
  }

  closeChangePwModal(): void {
    this.changePwModalOpen = false;
    this.changePwForm.reset({ userId: this.user.id });
  }
}
