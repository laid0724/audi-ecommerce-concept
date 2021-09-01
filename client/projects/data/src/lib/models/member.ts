import { Roles } from '../enums';
import { Order } from './order';
import { Product } from './product';
import { UserPhoto } from './user-photo';

export interface Member {
  id: number;
  email: string;
  phoneNumber: string;
  fullName: string;
  gender: string;
  firstName: string;
  lastName: string;
  isDisabled: boolean;
  emailConfirmed: boolean;
  createdAt: Date;
  lastActive: Date;
  userImage: UserPhoto;
  orders: Order[];
  roles: Roles[];
  likedProducts: Product[];
}
