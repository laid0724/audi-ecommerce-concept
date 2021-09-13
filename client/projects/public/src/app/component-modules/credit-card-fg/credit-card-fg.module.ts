import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { FormComponentsModule } from '../form-components/form-components.module';

import { CreditCardFgComponent } from './credit-card-fg.component';
import { CardNumberInputComponent } from './card-number-input/card-number-input.component';
import { CardExpirationDateInputComponent } from './card-expiration-date-input/card-expiration-date-input.component';
import { CardCvcInputComponent } from './card-cvc-input/card-cvc-input.component';
import { IconModule } from '../audi-ui/icon/icon.module';

const COMPONENTS = [
  CreditCardFgComponent,
  CardNumberInputComponent,
  CardExpirationDateInputComponent,
  CardCvcInputComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    FormComponentsModule,
    TranslocoModule,
    CreditCardDirectivesModule,
    IconModule,
  ],
  exports: [CreditCardFgComponent],
})
export class CreditCardFgModule {}
