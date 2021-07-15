import {
  AbstractControl,
  FormArray,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { endOfDay, isBefore, parseJSON } from 'date-fns';
import { isNullOrEmptyString } from './helpers';
import { DATE_REGEX } from './regex';

export function hasSameValueValidator(
  matchingControlName: string
): ValidatorFn {
  return (control: AbstractControl) => {
    const controlValue = control.value;
    const valueToCompare =
      // @ts-ignore
      control.parent.controls[benchmarkingControlName].value;

    return controlValue === valueToCompare ? null : { isNotSameValue: true };
  };
}

export function isEqualOrGreaterThanValidator(
  benchmarkingControlName: string
): ValidatorFn {
  return (control: AbstractControl) => {
    const controlValue = control.value;
    const controlValueBeingCompared =
      // @ts-ignore
      control.parent?.controls[benchmarkingControlName]?.value;

    return controlValue >= controlValueBeingCompared
      ? { isEqualOrGreaterThanAnotherControlValue: true }
      : null;
  };
}

export function isGreaterThanValidator(
  benchmarkingControlName: string
): ValidatorFn {
  return (control: AbstractControl) => {
    const controlValue = control.value;
    const controlValueBeingCompared =
      // @ts-ignore
      control.parent?.controls[benchmarkingControlName]?.value;

    return controlValue > controlValueBeingCompared
      ? { isGreaterThanAnotherControlValue: true }
      : null;
  };
}

export function isLessThanValidator(
  benchmarkingControlName: string
): ValidatorFn {
  return (control: AbstractControl) => {
    const controlValue = control.value;
    const controlValueBeingCompared =
      // @ts-ignore
      control.parent?.controls[benchmarkingControlName]?.value;

    return controlValue < controlValueBeingCompared
      ? { isLessThanAnotherControlValue: true }
      : null;
  };
}

export function clrDatagridRangeFilterValidator(
  control: AbstractControl
): ValidationErrors | null {
  const minControl = control.get('min');
  const maxControl = control.get('max');

  if (minControl != null && maxControl != null) {
    const { value: minValue } = minControl;
    const { value: maxValue } = maxControl;

    const hasRangeError =
      minValue != null && maxValue != null && minValue > maxValue;

    return hasRangeError ? { hasRangeError } : null;
  }
  return null;
}

export function clrDatagridDateRangeFilterValidator(
  control: AbstractControl
): ValidationErrors | null {
  const dateStartControl = control.get('dateStart');
  const dateEndControl = control.get('dateEnd');

  if (dateStartControl != null && dateEndControl != null) {
    const { value: dateStartValue } = dateStartControl;
    const { value: dateEndValue } = dateEndControl;

    const validDateFormatRegex = new RegExp(DATE_REGEX);

    if (
      validDateFormatRegex.test(dateStartValue) &&
      validDateFormatRegex.test(dateEndValue)
    ) {
      const hasRangeError =
        !isNullOrEmptyString(dateStartValue) &&
        !isNullOrEmptyString(dateEndValue) &&
        new Date(dateStartValue) > new Date(dateEndValue);
      return hasRangeError ? { hasRangeError } : null;
    }
  }
  return null;
}

export function atLeastOneSelectedValidator(
  fa: FormArray
): ValidationErrors | null {
  const atLeastOneSelected: boolean = fa.controls.some(({ value }) => !!value);

  const error: ValidationErrors | null = !atLeastOneSelected
    ? { atLeastOneSelectedError: true }
    : null;
  return error;
}

export function isEarlierThanTodayValidator(
  control: FormControl
): ValidationErrors | null {
  const date: string = control.value;

  if (date == null) {
    return null;
  }

  const isEarlierThanToday = isBefore(
    parseJSON(new Date(date)),
    endOfDay(new Date())
  );

  return isEarlierThanToday ? { isEarlierThanToday: true } : null;
}
