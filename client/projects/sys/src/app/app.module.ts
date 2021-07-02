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
import { QuillModule } from 'ngx-quill';

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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
