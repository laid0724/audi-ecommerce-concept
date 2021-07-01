import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import {
  ErrorInterceptorProvider,
  LoadingInterceptorProvider,
  LanguageHeaderInterceptorProvider,
  LanguageSelectorResolver,
  JwtInterceptorProvider,
} from '@audi/data';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { CdsModule } from '@cds/angular';
import { QuillModule } from "ngx-quill";

import '@cds/core/icon/register.js';

import { ClarityIcons, shoppingCartIcon } from '@cds/core/icon';

ClarityIcons.addIcons(shoppingCartIcon);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    CoreModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
    NgxSpinnerModule,
    HttpClientModule,
    CdsModule,
    QuillModule.forRoot(),
  ],
  providers: [
    ErrorInterceptorProvider,
    JwtInterceptorProvider,
    LoadingInterceptorProvider,
    LanguageHeaderInterceptorProvider,
    LanguageSelectorResolver,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
