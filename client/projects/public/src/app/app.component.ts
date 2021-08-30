import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AccountService,
  BusyService,
  isNullOrEmptyString,
  LanguageStateService,
  Roles,
  User,
} from '@audi/data';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { AlertService } from './component-modules/audi-ui/services/alert-service/alert.service';
import { NotificationService } from './component-modules/audi-ui/services/notification-service/notification.service';
import { CookieConsentAlertComponent } from './component-modules/alerts/cookie-consent-alert/cookie-consent-alert.component';
import { CookieService } from 'ngx-cookie-service';

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
    private alertService: AlertService,
    private transloco: TranslocoService,
    private cookieService: CookieService,
    private languageService: LanguageStateService
  ) {}

  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.languageService.setLanguageByRoute();

    this.isLoadingApiRequests$ = this.busyService.isBusy$.pipe(
      takeUntil(this.destroy$)
    );

    const cookieConsent = this.cookieService.get('cookieConsent');

    if (isNullOrEmptyString(cookieConsent)) {
      this.alertService.show(CookieConsentAlertComponent);
    }
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
        })
        .unsubscribe();
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
      this.notificationService.error(
        this.transloco.translate('errorMessages.notMember'),
        3000
      );
      this.accountService.logout();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
