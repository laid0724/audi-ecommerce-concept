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
} from '@audi/data';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AudiUiModule } from './component-modules/audi-ui/audi-ui.module';
import { NotificationModule } from './component-modules/audi-ui/notification/notification.module';
import { FormComponentsModule } from './component-modules/form-components/form-components.module';
import { ProjectAsTemplateDirective } from './component-modules/project-as-template.directive';

@NgModule({
  declarations: [AppComponent, ProjectAsTemplateDirective],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NotificationModule,
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
