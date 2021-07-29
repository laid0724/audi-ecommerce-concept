import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { User } from '../models/user';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.accountService.currentUser$.pipe(
      take(1),
      exhaustMap((currentUser: User | null) => {
        if (currentUser) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          });
        }
        return next.handle(request);
      })
    );
  }
}

// Provide this in the providers array of your app module:
export const JwtInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true,
};
