import { Address } from './address';
import { UserPhoto } from './user-photo';

export interface SensitiveUserDataDto {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  userImage: UserPhoto;
  address: Address;
  savedCreditCardLast4Digit: string;
  savedCreditCardType: string;
}
