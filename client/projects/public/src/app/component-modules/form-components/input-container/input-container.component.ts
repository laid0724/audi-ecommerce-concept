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
  USAGE

  <form [formGroup]="form">
    <audi-input-container
      formControlName="name"
      [label]="'Name'"
      [smallLabel]="' (optional)'"
      [iconName]="'search'"
      [isLightTheme]="false"
      [floatingLabel]="true"
    >
      <audi-control-description>lorem ipsum</audi-control-description>
      <audi-control-valid>lorem ipsum</audi-control-valid>
      <audi-control-error>required</audi-control-error>
    </audi-input-container>
  </form>
*/

@Component({
  selector: 'audi-input-container',
  templateUrl: './input-container.component.html',
  styleUrls: ['./input-container.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputContainerComponent),
      multi: true,
    },
  ],
})
export class InputContainerComponent implements OnInit, ControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective: FormControlDirective;

  textfieldComponents: any[];

  @Input() floatingLabel: boolean = true;
  @Input() isLightTheme: boolean = false;
  @Input() type: 'text' | 'number' | 'password' = 'text';
  @Input() iconName: string;
  @Input() label: string;
  @Input() smallLabel: string;

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

  ngOnInit(): void {
    const audiTextfieldModules = initAudiModules(AudiModuleName.Textfield);

    audiTextfieldModules.forEach((textfieldModule: AudiComponents) => {
      this.textfieldComponents = textfieldModule.components.upgradeElements();
    });
  }

  writeValue(value: any): void {
    this.formControlDirective.valueAccessor!.writeValue(value);

    this.textfieldComponents.forEach((textfield) => {
      setTimeout(() => {
        textfield.update();
      }, 0);
    });
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
