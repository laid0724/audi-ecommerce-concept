import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService, Roles, User } from '@audi/data';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from './component-modules/audi-ui/services/notification-service/notification.service';
@Component({
  selector: 'audi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();

  constructor(
    private accountService: AccountService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.setUserFromLocalStorage();
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
