import {
  FormGroup,
  FormArray,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, QueryParamsHandling, Router } from '@angular/router';
import { utcToZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import { PaginatedResult } from './models/pagination';
import { Gender, LanguageCode, OrderStatus } from './enums';

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

export function hasDuplicates(array: any[]): boolean {
  return new Set(array).size !== array.length;
}

export function stringToBoolean(string: string) {
  return string === 'false' ? false : !!string;
}

export function swapArrayElement(array: any[], from: number, to: number): void {
  array.splice(to, 0, array.splice(from, 1)[0]);
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
  if (isNullOrEmptyString(date)) {
    return null;
  }
  return new Date(date).toISOString();
}

export function clrDateFormat(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function toZhMapper(
  value: string | null | undefined | boolean,
  type?: string
): string {
  if (type === 'withEnglishBoolean') {
    switch (value) {
      case true:
        return '是 Yes';
      case false:
        return '否 No';
      default:
        return '';
    }
  }

  if (type === 'isVisibleWithEn') {
    switch (value) {
      case true:
        return '顯示 Visible';
      case false:
        return '隱藏 Hidden';
      default:
        return '';
    }
  }

  if (type === 'isDisabledWithEn') {
    switch (value) {
      case true:
        return '停權中 Disabled';
      case false:
        return '開啟中 Enabled';
      default:
        return '';
    }
  }

  if (type === 'emailConfirmedWithEn') {
    switch (value) {
      case true:
        return '已認證 Confirmed';
      case false:
        return '未認證 Not Confirmed';
      default:
        return '';
    }
  }

  if (type === 'isDiscountedWithEn') {
    switch (value) {
      case true:
        return '折扣中 Discounted';
      case false:
        return '原價 No Discount';
      default:
        return '';
    }
  }

  if (type === 'genderWithEn') {
    switch (value) {
      case Gender.Male:
        return '男 Male';
      case Gender.Female:
        return '女 Female';
      case Gender.Other:
        return '其他 Other';
    }
  }

  if (type === 'orderStatusWithEn') {
    switch (value) {
      case OrderStatus.Placed:
        return '已成立 Confirmed';
      case OrderStatus.Shipped:
        return '運送中 Shipped';
      case OrderStatus.Delivered:
        return '已送達 Delivered';
      case OrderStatus.Canceled:
        return '已取消 Canceled';
    }
  }

  switch (value) {
    case null || undefined || '':
      return '';
    case LanguageCode.Zh:
      return '中文';
    case LanguageCode.En:
      return '英文';

    case Gender.Male:
      return '男';
    case Gender.Female:
      return '女';
    case Gender.Other:
      return '其他';

    case true:
      return '是';
    case false:
      return '否';

    default:
      return '';
  }
}
