import { config } from 'dotenv';
import databaseService from './database.services';
import { RegisterReqBody, UpdateUserReqBody } from '~/models/requests/register.request';
import { ObjectId } from 'mongodb';
import { AccountStatus, RoleName, TokenType, UserVerifyStatus } from '~/constants/enum';
import { hashPassword } from '~/utils/helpers';
import { signToken, verifyToken } from '~/utils/jwt';
import User from '~/models/schemas/User.schemas';
import RefreshToken from '~/models/schemas/RefreshToken.schema';
import { USERS_MESSAGES } from '~/constants/message';
import { createAccountReq, updateAccountReq } from '~/models/requests/account.request';

config();

class UsersServices {
  async checkEmailExists(email: string) {
    const user = await databaseService.users.findOne({ email });
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
    const _id = new ObjectId();

    //tạo mới 1 user
    const newUser = await databaseService.users.insertOne(
      new User({
        _id,
        ...payload,
        password: await hashPassword(payload.password),
        status: AccountStatus.ACTIVE,
        birthday: new Date(payload.birthday)
      })
    );
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: _id.toString(),
      verify: UserVerifyStatus.Unverified
    });
    //lay user_id từ user vừa tạo
    const [access_token, refesh_token] = await this.signAccessTokenAndRefreshToken({
      user_id: _id.toString(),
      verify: UserVerifyStatus.Unverified
    });
    const { exp, iat } = await this.decodeRefreshToken(refesh_token);
    //lưu refesh token vào db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refesh_token,
        user_id: _id,
        exp,
        iat
      })
    );
    // giả lập gửi email verify token
    console.log(email_verify_token);

    return { access_token, refesh_token };
  }
  async getUserById(id: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(id) });
    return user;
  }
  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refesh_token] = await this.signAccessTokenAndRefreshToken({
      user_id,
      verify
    });
    const { exp, iat } = await this.decodeRefreshToken(refesh_token);
    //lưu refesh token vào db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refesh_token,
        user_id: new ObjectId(user_id),
        exp,
        iat
      })
    );

    return { access_token, refesh_token };
  }
  async updateUserProfileById(id: string, payload: UpdateUserReqBody) {
    const result = await databaseService.users.updateOne(
      {
        _id: new ObjectId(id)
      },
      [
        {
          $set: {
            ...payload,
            updated_at: '$$NOW'
          }
        }
      ]
    );
    return result;
  }
  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token });
    return { message: USERS_MESSAGES.LOGOUT_SUCCESS };
  }
  //create account dành cho admin
  async createAccount(payload: createAccountReq) {
    const _id = new ObjectId();
    const result = await databaseService.users.insertOne(
      new User({
        _id,
        ...payload,
        password: await hashPassword('123456'),
        status: AccountStatus.ACTIVE,
        role_name: RoleName.STAFF,
        full_name: `staffuser${_id.toString()}`,
        verify: UserVerifyStatus.Verified
      })
    );
    //trả ra thông tin user vừa tạo
    const user = await databaseService.users.findOne({ _id: new ObjectId(result.insertedId) });
    return user;
  }
  //update account dành cho admin
  async updateAccountById(id: string, payload: updateAccountReq) {
    const result = await databaseService.users.updateOne(
      {
        _id: new ObjectId(id)
      },
      [
        {
          $set: {
            ...payload,
            updated_at: '$$NOW'
          }
        }
      ]
    );
    //trả ra thông tin user vừa update
    const user = await databaseService.users.findOne({ _id: new ObjectId(id) });
    return user;
  }
  async getAccount() {
    const result = await databaseService.users.find({}).toArray();
    return result;
  }
  async deleteAccountById(id: string) {
    const result = await databaseService.users.deleteOne({ _id: new ObjectId(id) });
    if (!result.acknowledged)
      throw {
        message: USERS_MESSAGES.DELETE_ACCOUNT_FAIL
      };
    return id;
  }
  //hàm lấy ra role của user
  async getRole(user_id: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) });
    if (!user) throw new Error(USERS_MESSAGES.USER_NOT_FOUND);
    return user?.role_name;
  }
}
const usersService = new UsersServices();
export default usersService;
