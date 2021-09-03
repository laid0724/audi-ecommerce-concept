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
  USAGE

  <form [formGroup]="form">
    <audi-select-container
      formControlName="name"
      [label]="'name'"
      [smallLabel]="' (optional)'"
      [isLightTheme]="false"
      [floatingLabel]="true"
    >
      <option *ngFor="let value of [1, 2, 3, 4, 5, 6]" [value]="value">
        {{ value }}
      </option>
      <audi-control-description [type]="'select'"
        >lorem ipsum</audi-control-description
      >
      <audi-control-error [type]="'select'">required</audi-control-error>
    </audi-select-container>
  </form>
*/

@Component({
  selector: 'audi-select-container',
  templateUrl: './select-container.component.html',
  styleUrls: ['./select-container.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectContainerComponent),
      multi: true,
    },
  ],
})
export class SelectContainerComponent implements OnInit, ControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective: FormControlDirective;

  selectComponents: any[];

  @Input() floatingLabel: boolean = true;
  @Input() isLightTheme: boolean = false;
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

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    const audiSelectModules = initAudiModules(AudiModuleName.Select);

    audiSelectModules.forEach((selectModule: AudiComponents) => {
      this.selectComponents = selectModule.components.upgradeElements();
    });
  }

  writeValue(value: any): void {
    this.formControlDirective.valueAccessor!.writeValue(value);

    this.selectComponents.forEach((select) => {
      // HACK
      select._element.disabled = null;
      setTimeout(() => {
        select.updateClasses();
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
