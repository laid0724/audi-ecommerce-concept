import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Roles } from '../enums';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.accountService.currentUser$.pipe(
      map((user: User | null) => {
        if (user != null) {
          const isAdminOrModerator =
            user.roles.includes(Roles.Admin) ||
            user.roles.includes(Roles.Moderator);
          if (!isAdminOrModerator) {
            this.toastr.error('You cannot enter this area');
            return this.router.parseUrl('/login');
          }
          return isAdminOrModerator;
        }
        return this.router.parseUrl('/login');
      })
    );
  }

  canActivateChild(): Observable<boolean | UrlTree> {
    return this.canActivate();
  }
}
