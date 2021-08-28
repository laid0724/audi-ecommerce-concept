import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../audi-ui/button/button.module';
import { AlertModule } from '../audi-ui/alert/alert.module';
import { DirectivesModule } from '@audi/data';
import { TranslocoModule } from '@ngneat/transloco';

import { CookieConsentAlertComponent } from './cookie-consent-alert/cookie-consent-alert.component';

const COMPONENTS = [CookieConsentAlertComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    ButtonModule,
    AlertModule,
    DirectivesModule,
    TranslocoModule,
  ],
  exports: [...COMPONENTS],
})
export class AlertsModule {}
