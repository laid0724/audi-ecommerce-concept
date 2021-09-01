import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Roles } from '../enums';
import { TranslocoService } from '@ngneat/transloco';
import { NotificationService } from 'projects/public/src/app/component-modules/audi-ui/services/notification-service/notification.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root',
})
export class MemberGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountService: AccountService,
    private notificationService: NotificationService,
    private transloco: TranslocoService
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.accountService.currentUser$.pipe(
      map((user: User | null) => {
        if (user != null) {
          const Member = user.roles.includes(Roles.Member);
          if (!Member) {
            this.notificationService.error(
              this.transloco.translate('notifications.notMemberError'),
              this.transloco.translate('notifications.error'),
              3000
            );
            return this.router.parseUrl('/login');
          }
          return Member;
        }
        return this.router.parseUrl('/login');
      })
    );
  }

  canActivateChild(): Observable<boolean | UrlTree> {
    return this.canActivate();
  }
}
