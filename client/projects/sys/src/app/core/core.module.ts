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
  ],
})
export class CoreModule {}
