import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {
  AccountService,
  User,
  Roles,
  initAudiModules,
} from '@audi/data';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'audi-sys-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService
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
    const isAdminOrModerator =
      user.roles.includes(Roles.Admin) || user.roles.includes(Roles.Moderator);
    return isAdminOrModerator;
  }

  directUserBasedOnRole(isRightRole: boolean): void {
    if (!isRightRole) {
      this.toastr.error('你不是管理員 You are not an admin');
      this.accountService.logout();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
