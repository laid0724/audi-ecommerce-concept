import {
  FormGroup,
  FormArray,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from './models/pagination';
import { ActivatedRoute, QueryParamsHandling, Router } from '@angular/router';
import { utcToZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';

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

export function setQueryParams(
  router: Router,
  route: ActivatedRoute,
  queryParams = {},
  queryParamsHandling = '' as QueryParamsHandling
): void {
  // currently, no native angular method to clear query params on the same page
  // this is a workaround to that - by passing in an empty object
  // see: https://stackoverflow.com/questions/48552993/angular-5-remove-query-param
  // but I also want to reuse this helper fn to hard set query params in the same page
  // so i am making {} a default parameter value instead.
  router.navigate([], {
    relativeTo: route,
    queryParams,
    queryParamsHandling,
  });
}

export function isNullOrEmptyString(val: string | null | undefined): boolean {
  return val == null || (val && val.trim() === '') || val.length === 0;
}

export function stringToBoolean(string: string) {
  return string === 'false' ? false : !!string;
}

export function formControlAssertion(
  abstractControl: AbstractControl | null
): FormControl {
  return abstractControl as FormControl;
}

export function formGroupAssertion(
  abstractControl: AbstractControl | null
): FormGroup {
  return abstractControl as FormGroup;
}

export function getAllErrors(
  form: FormGroup | FormArray
): { [key: string]: any } | null {
  let hasError = false;

  let result = (Object.keys(form.controls) as string[]).reduce((acc, key) => {
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

  if (form instanceof FormGroup && form.errors) {
    hasError = true;
    result = {
      ...result,
      form: form.errors,
    };
  }

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

export function formatServerTimeToClrDate(date: string | Date): string | null {
  if (date == null) {
    return null;
  }

  const jsDateObject = new Date(date);
  const timeZone = 'Asia/Taipei';
  const zonedDate = utcToZonedTime(jsDateObject, timeZone);
  const clrDateFormat = format(zonedDate, 'MM/dd/yyyy');
  return clrDateFormat;
}

export function formatClrDateToUTCString(date: string): string | null {
  if (date == null) {
    return null;
  }
  return new Date(date).toISOString();
}

export function clrDateFormat(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
