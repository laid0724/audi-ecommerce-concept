import { Address } from './address';

export interface CreditCard {
  cardHolderName: string;
  cardNumber: string;
  cardType: string;
  CVV: string;
  expirationMonth: string;
  expirationYear: string;
  billingAddress: Address;
}
