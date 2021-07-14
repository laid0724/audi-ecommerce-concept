import { Component, forwardRef, Input, ViewChild } from '@angular/core';
import {
  FormControlDirective,
  ControlContainer,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormArray,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

export const FAQ_ITEMS_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FaqItemsComponent),
  multi: true,
};

@Component({
  selector: 'audi-sys-faq-items',
  templateUrl: './faq-items.component.html',
  styleUrls: ['./faq-items.component.scss'],
  providers: [FAQ_ITEMS_VALUE_ACCESSOR],
})
export class FaqItemsComponent implements ControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective: FormControlDirective;

  @Input() label: string;

  @Input() type = 'text';

  get array(): FormArray {
    return this.controlContainer.control as FormArray;
  }

  get faqItems(): FormGroup[] {
    return this.array.controls as FormGroup[];
  }

  constructor(
    private controlContainer: ControlContainer,
    private fb: FormBuilder
  ) {}

  addQA(): void {
    this.array.push(
      this.fb.group({
        question: [null, Validators.required],
        answer: [null, Validators.required],
      })
    );
  }

  removeQA(i: number): void {
    this.array.removeAt(i);
  }

  writeValue(value: any): void {
    this.formControlDirective.valueAccessor?.writeValue(value);
  }

  registerOnChange(fn: any): void {
    this.formControlDirective.valueAccessor?.registerOnTouched(fn);
  }

  registerOnTouched(fn: any): void {
    this.formControlDirective.valueAccessor?.registerOnChange(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    (this.formControlDirective.valueAccessor as any).setDisabledState(
      isDisabled
    );
  }
}
