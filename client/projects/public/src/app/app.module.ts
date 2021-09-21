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
  INJECT_API_ENDPOINT,
} from '@audi/data';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertsModule } from './component-modules/alerts/alerts.module';
import { AlertModule } from './component-modules/audi-ui/alert/alert.module';
import { NotificationModule } from './component-modules/audi-ui/notification/notification.module';
import { ProgressBarModule } from './component-modules/audi-ui/progress-bar/progress-bar.module';
import { CoreModule } from './core/core.module';
import { SplashScreenModule } from './feature-modules/splash-screen/splash-screen.module';
import { TranslocoRootModule } from './transloco/transloco-root.module';

const AUDI_MODULES = [NotificationModule, AlertModule, ProgressBarModule];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SplashScreenModule,
    CoreModule,
    TranslocoRootModule,
    AlertsModule,
    ...AUDI_MODULES,
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
    {
      provide: INJECT_API_ENDPOINT,
      useValue: environment.apiUrl,
    },
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
