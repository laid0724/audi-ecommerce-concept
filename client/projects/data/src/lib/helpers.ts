import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from './models/pagination';

export function getPaginationHeaders(
  pageNumber: number,
  pageSize: number
): HttpParams {
  let params = new HttpParams();

  params = params.append('pageNumber', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());

  return params;
}

export function getPaginatedResult<T>(
  http: HttpClient,
  url: string,
  params: HttpParams
): Observable<PaginatedResult<T>> {
  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
  return http
    .get<T>(url, {
      /*
          Angular's http client by default will return the response's body,
          changing this to 'response' will make httpclient return the whole thing,
          along with the headers
        */
      observe: 'response',
      params,
    })
    .pipe(
      map((response: HttpResponse<T>) => {
        paginatedResult.result = response.body as T;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get('Pagination') as string
          );
        }
        return paginatedResult;
      })
    );
}

export function getAllErrors(
  form: FormGroup | FormArray
): { [key: string]: any } | null {
  let hasError = false;
  const result = (Object.keys(form.controls) as string[]).reduce((acc, key) => {
    const control = form.get(key);
    const errors =
      control instanceof FormGroup || control instanceof FormArray
        ? getAllErrors(control)
        : control!.errors;
    if (errors) {
      acc[key] = errors;
      hasError = true;
    }
    return acc;
  }, {} as { [key: string]: any });
  return hasError ? result : null;
}

export function controlHasError(
  form: FormGroup,
  formControlName: string,
  errors: string[]
): boolean {
  const formControl = form.get(formControlName) as FormControl;
  let errorCount = 0;

  errors.forEach((err) => {
    if (formControl.hasError(err)) {
      errorCount++;
    }
  });

  return formControl.touched && formControl.invalid && errorCount > 0;
}

export function formatDateTimeToClrDate(date: string | Date): string | null {
  if (date == null) {
    return null;
  }
  const [y, m, d] = (date as string).split('T')[0].split('-');
  return [m, d, y].join('-');
}
export function formatClrDateToServerDate(date: string | Date): string | null {
  if (date == null) {
    return null;
  }
  const [m, d, y] = (date as string).split('T')[0].split('/');
  return [y, m, d].join('-');
}
