import { RoleName } from '~/constants/enum';

export interface createAccountReq {
  user_name: string;
  role_name: RoleName;
  birthday: string;
  phone_number: string;
  email: string;
}

export interface updateAccountReq {
  user_name?: string;
  role_name?: RoleName;
  birthday?: string;
  phone_number?: string;
  email?: string;
  gender?: string;
  url_image?: string;
  status?: string;
  tax_code?: string;
  date_provide_CCCD?: string;
  place_provide_CCCD?: string;
}
