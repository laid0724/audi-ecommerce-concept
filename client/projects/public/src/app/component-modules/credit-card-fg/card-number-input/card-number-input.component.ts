import {
  AfterViewInit,
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
import { AudiComponents, AudiModuleName, initAudiModules } from '@audi/data';
import { CreditCardFormatDirective } from 'angular-cc-library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/*
  USAGE

  <form [formGroup]="form">
    <audi-card-number-input
      formControlName="cardNumber"
      [label]="'Card Number'"
    >
      <audi-control-description>lorem ipsum</audi-control-description>
      <audi-control-valid>lorem ipsum</audi-control-valid>
      <audi-control-error>required</audi-control-error>
    </audi-card-number-input>
  </form>
*/

@Component({
  selector: 'audi-card-number-input',
  templateUrl: './card-number-input.component.html',
  styleUrls: ['./card-number-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CardNumberInputComponent),
      multi: true,
    },
  ],
})
export class CardNumberInputComponent
  implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor
{
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective: FormControlDirective;

  @ViewChild('ccNumber') ccNumber: CreditCardFormatDirective;

  textfieldComponents: any[];

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

  destroy$ = new Subject<boolean>();

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

  ngAfterViewInit(): void {
    const cardTypeControl = this.controlContainer.control?.get(
      'cardType'
    ) as FormControl;

    this.ccNumber.resolvedScheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cardType: string) => {
        cardTypeControl.patchValue(cardType);
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
