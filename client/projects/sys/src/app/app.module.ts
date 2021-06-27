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
  JwtInterceptorProvider
} from '@audi/data';
import { CoreModule } from "./core/core.module";
import { SHOW_LANGUAGE_SELECTOR } from "./tokens";
import { HttpClientModule } from "@angular/common/http";
import { CdsModule } from '@cds/angular';

// import '@cds/core/icon/register.js';
// import { ClarityIcons, userIcon } from '@cds/core/icon';
// ClarityIcons.addIcons(userIcon);

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
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    NgxSpinnerModule,
    HttpClientModule,
    CdsModule
  ],
  providers: [
    ErrorInterceptorProvider,
    JwtInterceptorProvider,
    LoadingInterceptorProvider,
    LanguageHeaderInterceptorProvider,
    {
      provide: SHOW_LANGUAGE_SELECTOR,
      useValue: true,
    },
    LanguageSelectorResolver,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
