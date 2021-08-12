import { Roles } from '../enums';
export interface User {
  id: number;
  userName: string;
  token: string;
  email: string;
  roles: Roles[];
  isDisabled: boolean;
  emailConfirmed: boolean;
  likedProductIds: number[]
}
