import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderModule } from '../component-modules/audi-ui/header/header.module';
import { ButtonModule } from '../component-modules/audi-ui/button/button.module';
import { IconModule } from '../component-modules/audi-ui/icon/icon.module';
import { NavModule } from '../component-modules/audi-ui/nav/nav.module';
import { LanguageSelectorModule } from './language-selector/language-selector.module';
import { NotificationServiceModule } from '../component-modules/audi-ui/services/notification-service/notification-service.module';
import { TranslocoModule } from '@ngneat/transloco';
import { FooterModule } from './footer/footer.module';
import { FormComponentsModule } from '../component-modules/form-components/form-components.module';
import { ModalModule } from '../component-modules/audi-ui/modal/modal.module';

import { NavComponent } from './nav/nav.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { LoginComponent } from './login/login.component';
import { AlertModule } from '../component-modules/audi-ui/alert/alert.module';
import { FlyoutModule } from '../component-modules/audi-ui/flyout/flyout.module';

const COMPONENTS = [
  NotFoundComponent,
  NavComponent,
  ServerErrorComponent,
  LoginComponent,
];

const IMPORT_MODULES = [
  CommonModule,
  RouterModule,
  HeaderModule,
  FormComponentsModule,
  LanguageSelectorModule,
  NotificationServiceModule,
  NavModule,
  AlertModule,
  ButtonModule,
  IconModule,
  ModalModule,
  TranslocoModule,
  FlyoutModule,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...IMPORT_MODULES, FooterModule],
  exports: [...COMPONENTS, FooterModule],
})
export class CoreModule {}
