export type Role = 'Admin' | 'Moderator' | 'Member';

export interface User {
  userName: string;
  token: string;
  email: string;
  roles: Role[];
}
