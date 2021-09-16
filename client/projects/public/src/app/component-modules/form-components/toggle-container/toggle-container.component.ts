import { Component, forwardRef, Input, ViewChild } from '@angular/core';
import {
  ControlValueAccessor,
  FormControlDirective,
  FormControl,
  ControlContainer,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { isNullOrEmptyString } from '@audi/data';

/*
  USAGE:

  <form [formGroup]="form">
    <audi-toggle-container
      formControlName="name"
      [labelLeft]="'left'"
      [labelRight]="'right'"
      [isLightTheme]="false"
    ></audi-toggle-container>
  </form>
*/

@Component({
  selector: 'audi-toggle-container',
  templateUrl: './toggle-container.component.html',
  styleUrls: ['./toggle-container.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleContainerComponent),
      multi: true,
    },
  ],
})
export class ToggleContainerComponent implements ControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective: FormControlDirective;

  @Input() isLightTheme: boolean = false;
  @Input() labelLeft: string;
  @Input() labelRight: string;
  @Input()
  isDisabled: boolean = false;

  @Input()
  formControl: FormControl;

  @Input()
  formControlName: string;

  get control(): FormControl {
    return (this.formControl ||
      this.controlContainer.control?.get(this.formControlName)) as FormControl;
  }

  public isNullOrEmptyString: (val: string | null | undefined) => boolean =
    isNullOrEmptyString;

  constructor(private controlContainer: ControlContainer) {}

  writeValue(value: any): void {
    this.formControlDirective.valueAccessor!.writeValue(value);
  }

  registerOnChange(fn: any): void {
    this.formControlDirective.valueAccessor!.registerOnChange(fn);
  }

  registerOnTouched(fn: any): void {
    this.formControlDirective.valueAccessor!.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.formControlDirective.valueAccessor!.setDisabledState!(isDisabled);
    this.isDisabled = isDisabled;
  }
}
