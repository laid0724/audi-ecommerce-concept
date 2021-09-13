import { Component, Input } from '@angular/core';
import {
  FormGroup,
  ControlContainer,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  CreditCardType,
  LanguageCode,
  LanguageStateService,
  NUMBER_REGEX,
} from '@audi/data';
import { CreditCardValidators } from 'angular-cc-library';

// see: https://github.com/thekip/angular-cc-library

export const creditCardFormGroupBuilder = (fb: FormBuilder) =>
  fb.group({
    cardHolderName: [null, [Validators.required]],
    cardNumber: [null, [CreditCardValidators.validateCCNumber]],
    cardType: [null, [Validators.required]],
    cardCVV: [
      null,
      [
        Validators.required,
        Validators.pattern(NUMBER_REGEX),
        Validators.minLength(3),
        Validators.maxLength(4),
      ],
    ],
    expirationDate: [
      null,
      [Validators.required, CreditCardValidators.validateExpDate],
    ],
  });

@Component({
  selector: 'audi-credit-card-fg',
  templateUrl: './credit-card-fg.component.html',
  styleUrls: ['./credit-card-fg.component.scss'],
})
export class CreditCardFgComponent {
  @Input() label: string;

  cardType: CreditCardType = CreditCardType.Unknown;

  get fg(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  get language(): LanguageCode {
    return this.languageService.getCurrentLanguage();
  }

  constructor(
    private controlContainer: ControlContainer,
    private languageService: LanguageStateService
  ) {}
}
