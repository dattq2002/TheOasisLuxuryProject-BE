import { config } from 'dotenv';
import databaseService from './database.services';
import { RegisterReqBody } from '~/models/requests/register.request';
import { ObjectId } from 'mongodb';
import Account from '~/models/schemas/Account.schemas';
import { AccountStatus, TokenType, UserVerifyStatus } from '~/constants/enum';
import { hashPassword } from '~/utils/helpers';
import { signToken, verifyToken } from '~/utils/jwt';
import User from '~/models/schemas/User.schemas';
import RefreshToken from '~/models/requests/RefreshToken.schema';

config();

class UsersServices {
  async checkEmailExists(email: string) {
    const user = await databaseService.accounts.findOne({ email });
    return Boolean(user);
  }
  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    });
  }
  //viết hàm nhận vào user_id để bỏ vào payload tạo access token
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, type: TokenType.AccessToken, verify },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
    });
  }
  private signRefreshToken({ user_id, verify, exp }: { user_id: string; verify: UserVerifyStatus; exp?: number }) {
    if (exp) {
      return signToken({
        payload: { user_id, type: TokenType.RefeshToken, verify, exp },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      });
    } else {
      return signToken({
        payload: { user_id, type: TokenType.RefeshToken, verify },
        options: { expiresIn: process.env.REFESH_TOKEN_EXPIRE_IN },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      });
    }
  }
  // hàm nhận vào user_id để bỏ vào payload tạo email verify token
  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, type: TokenType.EmailVerificationToken, verify },
      options: { expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
    });
  }
  //tạo hàm signForgotPasswordToken
  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.ForgotPasswordToken, verify },
      options: { expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRE_IN },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string //thêm
    });
  }
  private signAccessTokenAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })]);
  }
  async register(payload: RegisterReqBody) {
    const account_id = new ObjectId();
    // tạo email verify token
    const account = new Account({
      ...payload,
      _id: account_id,
      email: payload.email,
      password: hashPassword(payload.password),
      insert_date: new Date(),
      update_date: new Date(),
      status: AccountStatus.ACTIVE,
      role_id: '65b0811c41fd14b580f08ac7',
      user_name: `user${account_id.toString()}`
    });
    await databaseService.accounts.insertOne(account);

    //tạo mới 1 user
    const newUser = await databaseService.users.insertOne(
      new User({
        full_name: payload.full_name,
        phone_number: payload.phone_number,
        _id: account_id,
        account_id: account_id.toString(),
        birthday: payload.date_of_birth,
        insert_date: new Date(),
        update_date: new Date(),
        account: account
      })
    );
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: account_id.toString(),
      verify: UserVerifyStatus.Unverified
    });
    //lay user_id từ user vừa tạo
    const [access_token, refesh_token] = await this.signAccessTokenAndRefreshToken({
      user_id: account_id.toString(),
      verify: UserVerifyStatus.Unverified
    });
    const { exp, iat } = await this.decodeRefreshToken(refesh_token);
    //lưu refesh token vào db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refesh_token,
        user_id: account_id,
        exp,
        iat
      })
    );
    // giả lập gửi email verify token
    // console.log(email_verify_token);

    return { access_token, refesh_token };
  }
}
const usersService = new UsersServices();
export default usersService;
