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
  INJECT_TOASTR,
  INJECT_TRANSLOCO,
  INJECT_API_ENDPOINT,
} from '@audi/data';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';
import { environment } from '../environments/environment';

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
    QuillModule.forRoot(),
  ],
  providers: [
    ErrorInterceptorProvider,
    JwtInterceptorProvider,
    LoadingInterceptorProvider,
    LanguageHeaderInterceptorProvider,
    LanguageSelectorResolver,
    {
      provide: INJECT_TOASTR,
      useValue: true,
    },
    {
      provide: INJECT_TRANSLOCO,
      useValue: false,
    },
    {
      provide: INJECT_API_ENDPOINT,
      useValue: environment.apiUrl,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
