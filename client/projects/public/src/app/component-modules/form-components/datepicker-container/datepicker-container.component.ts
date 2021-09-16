import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { IDatePickerDirectiveConfig } from 'ng2-date-picker';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/*
  USAGE

  <form [formGroup]="form">
    <audi-datepicker-container
      formControlName="dateOfBirth"
      [label]="'Date of Birth'"
      [smallLabel]="' (optional)'"
      [iconName]="'search'"
      [isLightTheme]="false"
      [floatingLabel]="true"
    >
      <audi-control-description>lorem ipsum</audi-control-description>
      <audi-control-valid>lorem ipsum</audi-control-valid>
      <audi-control-error>required</audi-control-error>
    </audi-datepicker-container>
  </form>
*/

@Component({
  selector: 'audi-datepicker-container',
  templateUrl: './datepicker-container.component.html',
  styleUrls: ['./datepicker-container.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerContainerComponent),
      multi: true,
    },
  ],
})
export class DatepickerContainerComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective: FormControlDirective;

  textfieldComponents: any[];

  datePickerConfig: IDatePickerDirectiveConfig = {
    format: 'MM/DD/YYYY',
    showMultipleYearsNavigation: true,
  };

  @Input() floatingLabel: boolean = true;
  @Input() isLightTheme: boolean = false;
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

  destroy$ = new Subject<boolean>();

  public isNullOrEmptyString: (val: string | null | undefined) => boolean =
    isNullOrEmptyString;

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    const audiTextfieldModules = initAudiModules(AudiModuleName.Textfield);

    audiTextfieldModules.forEach((textfieldModule: AudiComponents) => {
      this.textfieldComponents = textfieldModule.components.upgradeElements();
    });

    this.controlContainer.statusChanges
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.textfieldComponents.forEach((textfield) => {
          setTimeout(() => {
            textfield.update();
          }, 0);
        });
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
    this.formControlDirective.valueAccessor!.registerOnChange(fn);
  }

  registerOnTouched(fn: any): void {
    this.formControlDirective.valueAccessor!.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.formControlDirective.valueAccessor!.setDisabledState!(isDisabled);
    this.isDisabled = isDisabled;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
