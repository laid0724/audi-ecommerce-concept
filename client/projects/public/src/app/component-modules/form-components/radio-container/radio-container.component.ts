import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  ControlValueAccessor,
  FormControlDirective,
  FormControl,
  ControlContainer,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { initAudiModules, AudiModuleName, AudiComponents } from '@audi/data';

/*
  USAGE:

  <form [formGroup]="form">
    <audi-control-grid
      [label]="'Radio'"
      [type]="'radio'"
      [isInvalid]="
        form.get('name')!.touched && form.get('name')!.hasError('required')
      "
    >
      <ng-container *projectAsField>
        <audi-radio-container
          formControlName="name"
          *ngFor="
            let option of [
              { value: 1, label: '1' },
              { value: 2, label: '2' },
              { value: 3, label: '3' },
              { value: 4, label: '4' },
              { value: 5, label: '5' }
            ]
          "
          [label]="option.label"
          [value]="option.value"
        ></audi-radio-container>
      </ng-container>

      <audi-control-error [type]="'grid'">required</audi-control-error>
    </audi-control-grid>
  </form>
*/

@Component({
  selector: 'audi-radio-container',
  templateUrl: './radio-container.component.html',
  styleUrls: ['./radio-container.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioContainerComponent),
      multi: true,
    },
  ],
})
export class RadioContainerComponent implements OnInit, ControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective: FormControlDirective;

  @Input() isLightTheme: boolean = false;
  @Input() label: string;
  @Input() value: any;

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

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    const audiRadioModules = initAudiModules(AudiModuleName.Radio);

    audiRadioModules.forEach((radioModule: AudiComponents) => {
      const radios = radioModule.components.upgradeElements();
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
