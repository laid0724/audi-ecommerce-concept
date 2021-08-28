import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderModule } from '../component-modules/audi-ui/header/header.module';
import { ButtonModule } from '../component-modules/audi-ui/button/button.module';
import { IconModule } from '../component-modules/audi-ui/icon/icon.module';
import { NavModule } from '../component-modules/audi-ui/nav/nav.module';
import { LanguageSelectorModule } from './language-selector/language-selector.module';

import { NotFoundComponent } from './not-found/not-found.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { FormComponentsModule } from '../component-modules/form-components/form-components.module';
import { NotificationServiceModule } from '../component-modules/audi-ui/services/notification-service/notification-service.module';
import { TranslocoModule } from '@ngneat/transloco';

const COMPONENTS = [NotFoundComponent, NavComponent, FooterComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    RouterModule,
    HeaderModule,
    ButtonModule,
    IconModule,
    NavModule,
    LanguageSelectorModule,
    FormComponentsModule,
    NotificationServiceModule,
    TranslocoModule,
  ],
  exports: [...COMPONENTS],
})
export class CoreModule {}
