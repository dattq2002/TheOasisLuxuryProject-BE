import { JwtPayload } from 'jsonwebtoken';
import { GenderType, TokenType, UserVerifyStatus } from '~/constants/enum';

export interface RegisterReqBody {
  full_name: string;
  birthday: string;
  phone_number: string;
  user_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface LoginReqBody {
  user_name: string;
  password: string;
}

export interface UpdateUserReqBody {
  full_name?: string;
  birthday?: Date;
  phone_number?: string;
  gender?: GenderType;
  url_image?: string;
}
export interface LogoutReqBody {
  refresh_token: string;
}

export interface TokenPayload extends JwtPayload {
  user_id: string;
  token_type: TokenType;
  verify: UserVerifyStatus;
  exp: number;
  iat: number;
}

export interface VerifyEmailReqBody {
  email_verify_token: string;
}

export interface ForgotPasswordReqBody {
  email: string;
}

export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string;
}

export interface ResetPasswordReqBody {
  forgot_password_token: string;
  password: string;
  confirm_password: string;
}

export interface RefreshTokenReqBody {
  refresh_token: string;
}

export interface OrderReqBody {
  user_id: string;
  price: number;
  start_date: Date;
  end_date: Date;
  description?: string;
  villa_id: string;
}

export interface PaymentReqBody {
  payment_type: string;
  order_id: string;
  amount: number;
}

export interface ConfirmPaymentReqBody {
  payment_id: string;
  order_id: string;
}

export interface CreateBlogReqBody {
  user_id: string;
  title: string;
  description_detail: string;
}

export interface CreateContractReqBody {
  order_id: string;
  contract_name: string;
  url_image: string;
  status: string;
}

export interface updateContractReqBody {
  sign_contract: boolean;
}

export interface updateOrderReqBody {
  status: string;
  price?: number;
  order_name: string;
}

export interface changePasswordReqBody {
  old_password: string;
  new_password: string;
  confirm_password: string;
}
