import { PagedRequest } from './pagination';

export interface MemberParams extends PagedRequest {
  email?: string;
  phoneNumber?: string;
  gender?: string;
  firstName?: string;
  lastName?: string;
  isDisabled?: boolean;
  emailConfirmed?: boolean;
}
