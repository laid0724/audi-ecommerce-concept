import { Component, forwardRef, Input } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import {
  Column,
  formControlAssertion,
  formGroupAssertion,
  WysiwygRowType,
} from '@audi/data';

// EXAMPLE USAGE:
// this.form = this.fb.group({
//   wysiwygGrid: this.fb.group(
//     {
//       rows: this.fb.array([]),
//     },
//     {
//       validators: [
//         wysiwygGridValidatorBuilderFn([
//           Validators.required
//         ]),
//       ],
//     }
//   ),
// });

// <audi-sys-wysiwyg-grid
//   formGroupName="wysiwygGrid"
//   [allowImage]="true"
//   [label]="'內容 Content'"
// ></audi-sys-wysiwyg-grid>

// TODO: put validator on the level of quill-editor so rquired validator
//       can be directly set on the content control, this is a mess
// FIXME: ExpressionChangedAfterItHasBeenCheckedError when this validator is used

export function wysiwygGridValidatorBuilderFn(
  validators: ValidatorFn[]
): ValidatorFn {
  // @ts-ignore
  return (fg: FormGroup): ValidationErrors | null => {
    if (
      !Array.isArray(validators) ||
      (validators as Array<ValidatorFn>).length < 1
    ) {
      return null;
    }

    (function addValidatorsToControl(wysiwygGridFG: FormGroup): void {
      const getContentFCRecursive = (form: FormGroup | FormArray) => {
        Object.keys(form.controls).forEach((field) => {
          const control = form.get(field);
          if (control instanceof FormGroup || control instanceof FormArray) {
            getContentFCRecursive(control);
          }
          if (
            field === 'content' &&
            (control as FormControl).validator == null
          ) {
            // setTimeout(() => {
            control?.setValidators(validators);
            control?.updateValueAndValidity({
              onlySelf: true,
              // emitEvent: false,
            });
            // });
          }
        });
      };
      getContentFCRecursive(wysiwygGridFG);
    })(fg);

    const findInvalidControlsRecursive = (
      wysiwygGridFG: FormGroup
    ): ValidationErrors[] => {
      const errors: ValidationErrors[] = [];
      const findInvalidControlsRecursive = (form: FormGroup | FormArray) => {
        Object.keys(form.controls).forEach((field) => {
          const control = form.get(field);
          if (control instanceof FormGroup || control instanceof FormArray) {
            findInvalidControlsRecursive(control);
          }
          if (control?.invalid && control.errors != null) {
            errors.push(control.errors);
          }
        });
      };
      findInvalidControlsRecursive(wysiwygGridFG);
      return errors;
    };

    const errors = [...new Set(findInvalidControlsRecursive(fg))];

    const validationErrors =
      errors?.length > 0
        ? errors.reduce(
            (
              errorsPayloadObj: ValidationErrors,
              errorObj: ValidationErrors
            ) => {
              return { ...errorsPayloadObj, ...errorObj };
            },
            {}
          )
        : null;

    return validationErrors;
  };
}

export const addWysiwygRow = (
  fb: FormBuilder,
  rowsFA: FormArray,
  type: WysiwygRowType
): void => {
  switch (type) {
    case WysiwygRowType.FourEight:
      rowsFA.push(
        fb.group({
          columns: fb.array([
            fb.group({
              width: 4,
              content: [null],
            }),
            fb.group({
              width: 8,
              content: [null],
            }),
          ]),
        })
      );
      break;
    case WysiwygRowType.EightFour:
      rowsFA.push(
        fb.group({
          columns: fb.array([
            fb.group({
              width: 8,
              content: [null],
            }),
            fb.group({
              width: 4,
              content: [null],
            }),
          ]),
        })
      );
      break;
    case WysiwygRowType.SixSix:
      rowsFA.push(
        fb.group({
          columns: fb.array([
            fb.group({
              width: 6,
              content: [null],
            }),
            fb.group({
              width: 6,
              content: [null],
            }),
          ]),
        })
      );
      break;
    case WysiwygRowType.Twelve:
    default:
      rowsFA.push(
        fb.group({
          columns: fb.array([
            fb.group({
              width: 12,
              content: [null],
            }),
          ]),
        })
      );
      break;
  }
};

@Component({
  selector: 'audi-sys-wysiwyg-grid',
  templateUrl: './wysiwyg-grid.component.html',
  styleUrls: ['./wysiwyg-grid.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WysiwygGridComponent),
      multi: true,
    },
  ],
})
export class WysiwygGridComponent implements ControlValueAccessor {
  @Input() label = '內容';
  @Input() allowImage: boolean = true;

  value: any;
  disabled: boolean;

  rowTypeSelectionModalOpen = false;
  types = Object.values(WysiwygRowType);
  selectedType: WysiwygRowType = WysiwygRowType.Twelve;

  get rows(): FormArray {
    return this.controlContainer.control?.get('rows') as FormArray;
  }

  getColumns(rowIndex: number): FormArray {
    return this.rows.controls[rowIndex].get('columns') as FormArray;
  }

  private onChangeFn: any;
  private onTouchedFn: any;

  constructor(
    private fb: FormBuilder,
    public controlContainer: ControlContainer
  ) {}

  formControlAssertion: (
    abstractControl: AbstractControl | null
  ) => FormControl = formControlAssertion;

  formGroupAssertion: (abstractControl: AbstractControl | null) => FormGroup =
    formGroupAssertion;

  writeValue(value: string): void {
    this.value = value;
    this.controlContainer.control?.updateValueAndValidity();
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleRowSelectionModal(): void {
    this.rowTypeSelectionModalOpen = !this.rowTypeSelectionModalOpen;
    this.controlContainer.control?.updateValueAndValidity();
  }

  addRow(type: WysiwygRowType): void {
    addWysiwygRow(this.fb, this.rows, type);
    this.toggleRowSelectionModal();
  }

  removeRow(rowIndex: number): void {
    this.rows.removeAt(rowIndex);
    this.controlContainer.control?.updateValueAndValidity();
  }

  // this should be of type CdkDragDrop<any[]> but angular compiler
  // insists that the event being passed in from the template and throws error
  onDrop(dropEvent: any) {
    if (dropEvent.previousIndex === dropEvent.currentIndex) {
      return;
    }

    const draggedRow = this.rows.at(dropEvent.previousIndex);
    this.rows.removeAt(dropEvent.previousIndex);
    this.rows.insert(dropEvent.currentIndex, draggedRow);
    this.controlContainer.control?.updateValueAndValidity();
  }

  is8or4Col(row: FormGroup): boolean {
    const columnWidths = row.value.columns.map((c: Column) => c.width);
    if (columnWidths.includes(4) || columnWidths.includes(8)) {
      return true;
    }
    return false;
  }

  reverse8or4Col(row: FormGroup): void {
    if (this.is8or4Col(row)) {
      const columnsFA: FormArray = row.get('columns') as FormArray;

      (columnsFA.controls as FormGroup[]).forEach((fg) => {
        const width = fg.get('width');

        if (width?.value === 4 || width?.value === 8) {
          width.patchValue(width.value === 4 ? 8 : 4);
        }
      });

      this.controlContainer.control?.updateValueAndValidity();
    }
  }
}
