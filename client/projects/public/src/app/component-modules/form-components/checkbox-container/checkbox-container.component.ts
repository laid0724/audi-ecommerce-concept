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
    <audi-checkbox-container
      class="block my-3"
      formControlName="name"
      [label]="'Do you agree to blah blah blah?'"
    >
      <audi-control-error [type]="'checkbox'"
        >lorem ipsum lorem ipsum required blah blah blah</audi-control-error
      >
    </audi-checkbox-container>

    <audi-control-grid
      class="mt-5 block"
      [label]="'Checkbox'"
      [type]="'checkbox'"
      [isInvalid]="form.get('group')!.touched && form.get('group')!.invalid"
    >
      <ng-container *projectAsField>
        <ng-container formGroupName="group">
          <audi-checkbox-container
            formControlName="name1"
            [label]="'name1'"
          ></audi-checkbox-container>
          <audi-checkbox-container
            formControlName="name2"
            [label]="'name2'"
          ></audi-checkbox-container>
          <audi-checkbox-container
            formControlName="name3"
            [label]="'name3'"
          ></audi-checkbox-container>
          <audi-checkbox-container
            formControlName="name4"
            [label]="'name4'"
          ></audi-checkbox-container>
          <audi-checkbox-container
            formControlName="name5"
            [label]="'name5'"
          ></audi-checkbox-container>
        </ng-container>
      </ng-container>

      <audi-control-error [type]="'grid'">required</audi-control-error>
    </audi-control-grid>
  </form>
*/

@Component({
  selector: 'audi-checkbox-container',
  templateUrl: './checkbox-container.component.html',
  styleUrls: ['./checkbox-container.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxContainerComponent),
      multi: true,
    },
  ],
})
export class CheckboxContainerComponent
  implements OnInit, ControlValueAccessor
{
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective: FormControlDirective;

  @Input() isLightTheme: boolean = false;
  @Input() label: string;
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
    const audiCheckboxModules = initAudiModules(AudiModuleName.Checkbox);

    audiCheckboxModules.forEach((checkboxModule: AudiComponents) => {
      const checkboxes = checkboxModule.components.upgradeElements();
    });
  }

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
