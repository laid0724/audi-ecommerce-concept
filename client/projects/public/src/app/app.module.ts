import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ErrorInterceptorProvider,
  JwtInterceptorProvider,
  LoadingInterceptorProvider,
  LanguageHeaderInterceptorProvider,
  LanguageSelectorResolver,
  INJECT_TOASTR,
  INJECT_TRANSLOCO,
} from '@audi/data';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertsModule } from './component-modules/alerts/alerts.module';
import { AudiUiModule } from './component-modules/audi-ui/audi-ui.module';
import { CoreModule } from './core/core.module';
import { SplashScreenModule } from './feature-modules/splash-screen/splash-screen.module';
import { TranslocoRootModule } from './transloco/transloco-root.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AudiUiModule,
    SplashScreenModule,
    CoreModule,
    TranslocoRootModule,
    AlertsModule,
  ],
  providers: [
    ErrorInterceptorProvider,
    JwtInterceptorProvider,
    LoadingInterceptorProvider,
    LanguageHeaderInterceptorProvider,
    LanguageSelectorResolver,
    {
      provide: INJECT_TOASTR,
      useValue: false,
    },
    {
      provide: INJECT_TRANSLOCO,
      useValue: true,
    },
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
