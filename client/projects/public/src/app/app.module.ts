import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ErrorInterceptorProvider,
  JwtInterceptorProvider,
  LoadingInterceptorProvider,
  LanguageHeaderInterceptorProvider,
  LanguageSelectorResolver,
  INJECT_TOASTR,
  AttributeSetterDirective,
} from '@audi/data';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AudiUiModule } from './component-modules/audi-ui/audi-ui.module';
import { FormComponentsModule } from './component-modules/form-components/form-components.module';
import { ProjectAsTemplateDirective } from './component-modules/project-as-template.directive';
import { SplashScreenModule } from './feature-modules/splash-screen/splash-screen.module';

const DIRECTIVES = [ProjectAsTemplateDirective, AttributeSetterDirective];

@NgModule({
  declarations: [AppComponent, ...DIRECTIVES],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SplashScreenModule,
    AudiUiModule,
    FormComponentsModule,
    ReactiveFormsModule,
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
