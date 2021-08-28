import { Component, OnInit } from '@angular/core';
import { isNullOrEmptyString } from '@audi/data';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'audi-cookie-consent-alert',
  templateUrl: './cookie-consent-alert.component.html',
  styleUrls: ['./cookie-consent-alert.component.scss'],
})
export class CookieConsentAlertComponent implements OnInit {
  cookieConsent: boolean | null;

  // see: https://github.com/stevermeister/ngx-cookie-service
  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
    const cookieConsent = this.cookieService.get('cookieConsent');

    if (isNullOrEmptyString(cookieConsent)) {
      this.cookieConsent = null;
    }
  }

  setCookieConsent(value: number): void {
    this.cookieService.set('cookieConsent', value.toString());
  }
}
