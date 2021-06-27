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
import { LanguageCode } from '../models/language-code';

@Injectable()
export class LanguageHeaderInterceptor implements HttpInterceptor {
  constructor(private languageService: LanguageStateService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.languageService.language$.pipe(
      switchMap((language: LanguageCode) => {
        let headers: HttpHeaders;
        headers = request.headers.set('X-LANGUAGE', language);
        headers = request.headers.set('Accept', 'application/json');

        request = request.clone({
          headers,
        });

        return next.handle(request);
      })
    );
  }
}

export const LanguageHeaderInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: LanguageHeaderInterceptor,
  multi: true,
};
