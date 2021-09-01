import { Inject, Injectable, Injector, Optional } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { NotificationService } from 'projects/public/src/app/component-modules/audi-ui/services/notification-service/notification.service';
import { INJECT_TOASTR, INJECT_TRANSLOCO } from '../tokens';
import { TranslocoService } from '@ngneat/transloco';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  toastr: ToastrService | null;
  transloco: TranslocoService | null;

  constructor(
    @Inject(INJECT_TOASTR) private injectToastr: boolean,
    @Inject(INJECT_TRANSLOCO) private injectTransloco: boolean,
    @Optional() private audiNotificationService: NotificationService,
    private injector: Injector,
    private router: Router
  ) {
    // here, we are using injector to conditionally inject the toastr service based on the INJECT_TOASTR token.
    // i am doing this because the @Optional decorator does not work with toastr service, as it insists on looking for its module when injected
    // see: https://stackoverflow.com/questions/43450259/how-to-conditionally-inject-service-into-component
    // and see: https://stackoverflow.com/questions/52110168/angular-6-is-it-possible-to-inject-service-by-condition
    if (injectToastr) {
      this.toastr = injector.get<ToastrService>(ToastrService);
    }
    if (injectTransloco) {
      this.transloco = injector.get<TranslocoService>(TranslocoService);
    }
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 400: // bad requests
            const errors = error.error.errors; // for validation errors, which is stored as array with several dimensions
            if (errors) {
              const modalStateErrors = [];
              for (const key in errors) {
                if (errors[key]) {
                  modalStateErrors.push(errors[key]);
                }
              }
              throw modalStateErrors.flat(Infinity);
            } else if (typeof error.error === 'object') {
              this.toastr?.error(error.statusText, error.status.toString());
              // TODO: transloco
              this.audiNotificationService?.error(
                error.statusText,
                error.status.toString(),
                3000
              );
            } else {
              this.toastr?.error(
                error.error,
                `${error.status.toString()} ${error.statusText}`
              );
              this.audiNotificationService?.error(
                error.error,
                `${error.status.toString()} ${error.statusText}`,
                3000
              );
            }
            break;
          case 401: // Unauthorized
            // this.toastr.error(error.statusText, error.status.toString());
            this.toastr?.error(
              'Wrong username or password',
              '錯誤的帳戶或密碼'
            );
            if (
              this.audiNotificationService != null &&
              this.transloco != null
            ) {
              this.audiNotificationService.error(
                this.transloco.translate('notifications.error401'),
                this.transloco.translate('notifications.error'),
                3000
              );
            }
            break;
          case 403: // Forbidden
            // TODO: aggregate all cases and show display messages accordingly, e.g., email_not_confirmed, locked_out, etc
            this.toastr?.error(
              error.error,
              `${error.status} ${error.statusText}`
            );
            // TODO: transloco
            this.audiNotificationService?.error(
              error.error,
              `${error.status} ${error.statusText}`,
              3000
            );
            break;
          case 404: // Not Found
            // NOTE: be careful with this - your APIs cannot throw 404 unless it really is a case of 404.
            // this.router.navigateByUrl('/not-found');
            this.toastr?.error(
              error.error,
              `${error.status} ${error.statusText}`
            );
            // handle 404 manually in public site
            break;
          case 500: // Internal Server Error
            // here we redirect as well but we add on NavigationExtras as a message to be passed to the page
            const navigationExtras: NavigationExtras = {
              state: {
                error: error.error,
              },
            };
            this.router.navigateByUrl('/server-error', navigationExtras);
            break;
          default:
            this.toastr?.error('Something unexpected went wrong.');
            console.log('Error Caught::', error);
            break;
        }
        return throwError(error);
      })
    );
  }
}

// Provide this in the providers array of your app module:
export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
