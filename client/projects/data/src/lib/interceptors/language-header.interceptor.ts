import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LanguageStateService } from '../services/language-state.service';
import { switchMap } from 'rxjs/operators';
import { LanguageCode } from '../enums';

@Injectable()
export class LanguageHeaderInterceptor implements HttpInterceptor {
  constructor(private languageService: LanguageStateService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.languageService.language$.pipe(
      switchMap((language: LanguageCode) =>
        next.handle(
          request.clone({
            headers: request.headers.set('X-LANGUAGE', language),
          })
        )
      )
    );
  }
}

export const LanguageHeaderInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: LanguageHeaderInterceptor,
  multi: true,
};
