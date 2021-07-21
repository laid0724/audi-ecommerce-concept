import { Order } from './order';
import { UserPhoto } from './user-photo';

export interface Member {
  id: number;
  email: string;
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
}
