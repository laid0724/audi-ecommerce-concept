import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService, hasSameValueValidator, User } from '@audi/data';
import { ClrForm, ClrLoadingState } from '@clr/angular';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'audi-sys-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  @ViewChild(ClrForm, { static: false }) clrForm: ClrForm;

  user: User | null;

  changePwForm: FormGroup;
  changePwModalOpen: boolean = false;
  changePwBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  destroy$ = new Subject<boolean>();

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.accountService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User | null) => {
        this.user = user;
      });

    this.initChangePwForm();
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
      this.clrForm.markAsTouched();
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
            this.toastr.success(
              'Password changed successfully',
              '密碼更改成功'
            );
          },
          (error) => {
            this.changePwBtnState = ClrLoadingState.ERROR;
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
