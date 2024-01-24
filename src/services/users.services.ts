import { config } from 'dotenv';
import databaseService from './database.services';

config();

class UsersServices {
  async checkEmailExists(email: string) {
    const user = await databaseService.accounts.findOne({ email });
    return Boolean(user);
  }
  //   async register(payload: RegisterReqBody) {
  //     const user_id = new ObjectId();
  //     //tạo email verify token
  //     const email_verify_token = await this.signEmailVerifyToken({
  //       user_id: user_id.toString(),
  //       verify: UserVerifyStatus.Unverified
  //     });
  //     await databaseService.users.insertOne(
  //       new User({
  //         ...payload,
  //         _id: user_id,
  //         email_verify_token,
  //         username: `user${user_id.toString()}`,
  //         date_of_birth: new Date(payload.date_of_birth),
  //         password: hashPassword(payload.password)
  //       })
  //     );

  //     //lay user_id từ user vừa tạo
  //     const [access_token, refesh_token] = await this.signAccessTokenAndRefreshToken({
  //       user_id: user_id.toString(),
  //       verify: UserVerifyStatus.Unverified
  //     });
  //     const { exp, iat } = await this.decodeRefreshToken(refesh_token);
  //     //lưu refesh token vào db
  //     await databaseService.refreshTokens.insertOne(
  //       new RefreshToken({
  //         token: refesh_token,
  //         user_id: new ObjectId(user_id),
  //         exp,
  //         iat
  //       })
  //     );
  //     // giả lập gửi email verify token
  //     console.log(email_verify_token);

  //     return { access_token, refesh_token };
  //   }
}
const usersService = new UsersServices();
export default usersService;
