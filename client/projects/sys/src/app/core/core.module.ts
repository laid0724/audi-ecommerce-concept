import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { NavComponent } from './nav/nav.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';
import { ServerErrorComponent } from './server-error/server-error.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CdsModule } from '@cds/angular';

import '@cds/core/icon/register.js';

import { ClarityIcons, userIcon } from '@cds/core/icon';

ClarityIcons.addIcons(userIcon);

@NgModule({
  declarations: [
    LoginComponent,
    NavComponent,
    NotFoundComponent,
    ServerErrorComponent,
  ],
  imports: [
    CommonModule,
    ClarityModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule,
    CdsModule,
  ],
})
export class CoreModule {}
