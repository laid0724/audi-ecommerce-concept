import { AfterViewInit } from '@angular/core';
import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  AudiComponents,
  AudiModuleName,
  initAudiModules,
  isNullOrEmptyString,
} from '@audi/data';

/*
  USAGE:

    <form [formGroup]="form">
    <audi-textarea-container
      formControlName="name"
      [label]="'Name'"
      [smallLabel]="' (optional)'"
      [isLightTheme]="false"
      [wordLimit]="160"
      ><audi-control-description>lorem ipsum</audi-control-description>
      <audi-control-valid>lorem ipsum</audi-control-valid>
      <audi-control-error>required</audi-control-error></audi-textarea-container
    >
  </form>
*/

@Component({
  selector: 'audi-textarea-container',
  templateUrl: './textarea-container.component.html',
  styleUrls: ['./textarea-container.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaContainerComponent),
      multi: true,
    },
  ],
})
export class TextareaContainerComponent
  implements AfterViewInit, ControlValueAccessor
{
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective: FormControlDirective;

  @Input() isLightTheme: boolean = false;
  @Input() label: string;
  @Input() smallLabel: string;
  @Input() rows: number = 3;
  @Input() wordLimit: number | null = null;

  @Input()
  formControl: FormControl;

  @Input()
  formControlName: string;

  get control(): FormControl {
    return (this.formControl ||
      this.controlContainer.control?.get(this.formControlName)) as FormControl;
  }

  isDisabled: boolean = false;

  public isNullOrEmptyString: (val: string | null | undefined) => boolean =
    isNullOrEmptyString;

  constructor(private controlContainer: ControlContainer) {}

  ngAfterViewInit(): void {
    // we're using after view init instead of on init so that the word limit feature works
    // given that this life cycle happens after input has been passed in
    const audiTextfieldModules = initAudiModules(AudiModuleName.Textfield);

    audiTextfieldModules.forEach((textfieldModule: AudiComponents) => {
      const textfields = textfieldModule.components.upgradeElements();
    });
  }

  writeValue(value: any): void {
    this.formControlDirective.valueAccessor!.writeValue(value);
  }

  registerOnChange(fn: any): void {
    this.formControlDirective.valueAccessor!.registerOnTouched(fn);
  }

  registerOnTouched(fn: any): void {
    this.formControlDirective.valueAccessor!.registerOnChange(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.formControlDirective.valueAccessor!.setDisabledState!(isDisabled);
    this.isDisabled = isDisabled;
  }
}
