import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AccountService, BusyService, Roles, User } from '@audi/data';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from './component-modules/audi-ui/services/alert-service/alert.service';
import { NotificationService } from './component-modules/audi-ui/services/notification-service/notification.service';

@Component({
  selector: 'audi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  destroy$ = new Subject<boolean>();

  isLoadingApiRequests$: Observable<boolean>;

  constructor(
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private busyService: BusyService,
    private notificationService: NotificationService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.setUserFromLocalStorage();

    this.isLoadingApiRequests$ = this.busyService.isBusy$.pipe(
      takeUntil(this.destroy$)
    );
  }

  ngAfterViewChecked(): void {
    // this is necessary because angular will throw after view checked error
    // everytime isBusy state changes for the progress bar
    this.cdr.detectChanges();
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
    } else {
      this.accountService.setCurrentUser(null);
    }
  }

  userHasRightRole(user: User): boolean {
    const isMember = user.roles.includes(Roles.Member);
    return isMember;
  }

  directUserBasedOnRole(isRightRole: boolean): void {
    if (!isRightRole) {
      // TODO: transloco
      this.notificationService.error('你不是會員 You are not a member');
      this.accountService.logout();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
