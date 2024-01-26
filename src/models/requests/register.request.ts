import { JwtPayload } from 'jsonwebtoken';
import { TokenType, UserVerifyStatus } from '~/constants/enum';

export interface RegisterReqBody {
  full_name: string;
  birthday: Date;
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

export interface TokenPayload extends JwtPayload {
  user_id: string;
  token_type: TokenType;
  verify: UserVerifyStatus;
  exp: number;
  iat: number;
}
