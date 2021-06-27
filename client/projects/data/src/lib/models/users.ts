import { Roles } from "../enums";
export interface User {
  userName: string;
  token: string;
  email: string;
  roles: Roles[];
}
