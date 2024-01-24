import { JwtPayload } from 'jsonwebtoken';
import { TokenType, UserVerifyStatus } from '~/constants/enum';

export interface RegisterReqBody {
  user_name: string;
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
  phone_number: string;
  date_of_birth: Date;
}

export interface TokenPayload extends JwtPayload {
  user_id: string;
  token_type: TokenType;
  verify: UserVerifyStatus;
  exp: number;
  iat: number;
}
