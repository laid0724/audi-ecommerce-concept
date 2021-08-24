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
} from '@audi/data';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AudiUiModule } from './component-modules/audi-ui/audi-ui.module';
import { SplashScreenModule } from './feature-modules/splash-screen/splash-screen.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AudiUiModule,
    SplashScreenModule,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
