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
  JwtInterceptorProvider,
  LoadingInterceptorProvider,
} from '@audi/data';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
  ],
  providers: [
    ErrorInterceptorProvider,
    JwtInterceptorProvider,
    LoadingInterceptorProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
