import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

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
      control.parent.controls[benchmarkingControlName].value;

    return controlValue >= controlValueBeingCompared
      ? { isGreaterThanAnotherControlValue: true }
      : null;
  };
}
