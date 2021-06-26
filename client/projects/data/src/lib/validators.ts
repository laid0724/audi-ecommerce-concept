import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

export function controlsHaveSameValueValidator(
  matchingControlName: string
): ValidatorFn {
  return (control: AbstractControl) => {
    const controlValue = control.value;

    /**
    * if you try to access the control as an object property via control.parent.controls[matchingControlName] directly
    * typescript will not be happy because it thinks AbstractControl can't be indexed via a string
    * see: https://stackoverflow.com/questions/40358434/typescript-ts7015-element-implicitly-has-an-any-type-because-index-expression
    **/

    const valueToCompare =
      control.parent != null && Array.isArray(control.parent.controls)
        ?
          (control.parent.controls as unknown as { [key: string]: AbstractControl })[
            matchingControlName
          ]?.value
        : null;

    return controlValue === valueToCompare ? null : { isNotSameValue: true };
  };
}
