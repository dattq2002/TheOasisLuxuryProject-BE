import { config } from 'dotenv';
import databaseService from '../databases/database.service';
import {
  CreateBlogReqBody,
  CreateContractReqBody,
  OrderReqBody,
  PaymentReqBody,
  RegisterReqBody,
  UpdateUserReqBody,
  updateContractReqBody,
  updateOrderReqBody
} from '~/models/requests/user.request';
import { ObjectId } from 'mongodb';
import {
  AccountStatus,
  GenderType,
  OrderStatus,
  PaymentStatus,
  RoleName,
  TokenType,
  UserVerifyStatus
} from '~/constants/enum';
import { hashPassword, sendMail } from '~/utils/helpers';
import { signToken, verifyToken } from '~/utils/jwt';
import User from '~/models/schemas/User.schemas';
import RefreshToken from '~/models/schemas/RefreshToken.schema';
import { USERS_MESSAGES } from '~/constants/message';
import { createAccountReq, updateAccountReq } from '~/models/requests/account.request';
import Order from '~/models/schemas/Order.schemas';
import Payment from '~/models/schemas/Payment.schemas';
import BlogPost from '~/models/schemas/BlogPost.schemas';
import Contract from '~/models/schemas/Contract.schemas';
import { ErrorWithStatus } from '~/models/Error';
import HTTP_STATUS from '~/constants/httpStatus';

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
        payload: { user_id, type: TokenType.RefreshToken, verify, exp },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      });
    } else {
      return signToken({
        payload: { user_id, type: TokenType.RefreshToken, verify },
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
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: _id.toString(),
      verify: UserVerifyStatus.Unverified
    });
    //tạo mới 1 user
    await databaseService.users.insertOne(
      new User({
        _id,
        ...payload,
        password: await hashPassword(payload.password),
        status: AccountStatus.ACTIVE,
        birthday: new Date(payload.birthday),
        email_verify_token: email_verify_token
      })
    );

    //lay user_id từ user vừa tạo
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id: _id.toString(),
      verify: UserVerifyStatus.Unverified
    });
    const { exp, iat } = await this.decodeRefreshToken(refresh_token);
    //lưu Refresh token vào db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: _id,
        exp,
        iat
      })
    );

    // // giả lập gửi email verify token
    // console.log(email_verify_token);
    sendMail({ toEmail: payload.email, token: email_verify_token, type: 'verify-email' });

    return { access_token, refresh_token };
  }
  async getUserById(id: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      });
    }
    //tìm tất cả các blog post của user này
    const blog_posts = await databaseService.blogPosts.find({ user_id: new ObjectId(id) }).toArray();
    //tìm tất cả các contract của user này
    const contracts = await databaseService.contracts.find({ user_id: new ObjectId(id) }).toArray();
    const orders = await databaseService.orders.find({ user_id: new ObjectId(id) }).toArray();
    //assign tất cả blogpost vào user
    if (user) {
      user.blog_posts = blog_posts;
      user.contracts = contracts;
      user.orders = orders;
    }
    return user;
  }
  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id,
      verify
    });
    const { exp, iat } = await this.decodeRefreshToken(refresh_token);
    //lưu Refresh token vào db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id),
        exp,
        iat
      })
    );

    return { access_token, refresh_token, user_id };
  }
  async updateUserProfileById(id: string, payload: UpdateUserReqBody) {
    const user = await this.getUserById(id);
    const result = await databaseService.users.updateOne(
      {
        _id: user._id
      },
      [
        {
          $set: {
            ...payload,
            update_date: '$$NOW'
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
        verify: UserVerifyStatus.Verified,
        birthday: new Date(payload.birthday),
        gender: GenderType.OTHER
      })
    );
    const user = await this.getUserById(result.insertedId.toString());
    return user;
  }
  //update account dành cho admin
  async updateAccountById(id: string, payload: updateAccountReq) {
    const user = await this.getUserById(id);
    await databaseService.users.updateOne(
      {
        _id: user._id
      },
      [
        {
          $set: {
            ...payload,
            update_date: '$$NOW'
          }
        }
      ]
    );
    return user;
  }
  async getAccount() {
    const result = await databaseService.users.find({}).toArray();
    return result;
  }
  async deleteAccountById(id: string) {
    const userAccount = await this.getRole(id);
    if (userAccount === RoleName.ADMIN) {
      throw new ErrorWithStatus({ message: USERS_MESSAGES.CANNOT_DELETE_ADMIN_ACCOUNT, status: HTTP_STATUS.FORBIDDEN });
    }
    const result = await databaseService.users.deleteOne({ _id: new ObjectId(id) });
    if (!result.acknowledged)
      throw {
        message: USERS_MESSAGES.DELETE_ACCOUNT_FAIL
      };
    return id;
  }
  //hàm lấy ra role của user
  async getRole(user_id: string) {
    const user = await this.getUserById(user_id);
    return user.role_name;
  }
  async verifyEmail(user_id: string) {
    //cập nhật lại user'
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            verify: UserVerifyStatus.Verified, //1
            email_verify_token: '',
            updated_at: '$$NOW'
          }
        }
      ]
    );
    //tạo access token và refresh token
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id,
      verify: UserVerifyStatus.Verified
    });
    const { exp, iat } = await this.decodeRefreshToken(refresh_token);
    //lưu Refresh token vào db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id),
        exp,
        iat
      })
    );
    return { access_token, refresh_token };
  }

  async resendEmailVerify(user_id: string) {
    //tạo email verify token
    const email_verify_token = await this.signEmailVerifyToken({
      user_id,
      verify: UserVerifyStatus.Unverified
    });
    //cập nhật lại user
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            email_verify_token,
            updated_at: '$$NOW'
          }
        }
      ]
    );
    const user = await this.getUserById(user_id);
    //gửi email cho user
    sendMail({ toEmail: user.email, token: email_verify_token, type: 'resend-verify-email' });
    return {
      message: USERS_MESSAGES.RESEND_EMAIL_VERIFY_SUCCESS
    };
  }
  async forgotPassword({ user_id, verify, email }: { user_id: string; verify: UserVerifyStatus; email: string }) {
    //tạo ra forgot_password_token
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify });
    //cập nhật vào forgot_password_token và user_id
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token: forgot_password_token,
          updated_at: '$$NOW'
        }
      }
    ]);
    sendMail({ toEmail: email, token: forgot_password_token, type: 'verify-forgot-password-token' });
    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    };
  }

  async resetPassword({ user_id, password }: { user_id: string; password: string }) {
    const user = await this.getUserById(user_id);
    await databaseService.users.updateOne(
      {
        _id: user._id
      },
      [
        {
          $set: {
            password: hashPassword(password),
            forgot_password_token: '',
            update_date: '$$NOW'
          }
        }
      ]
    );
    return { message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS };
  }
  async refreshToken({
    user_id,
    refresh_token,
    verify,
    exp
  }: {
    user_id: string;
    refresh_token: string;
    verify: UserVerifyStatus;
    exp: number;
  }) {
    //tạo ra access token mới và refresh token mới
    const [access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify, exp })
    ]);
    const { iat } = await this.decodeRefreshToken(refresh_token);
    await databaseService.refreshTokens.deleteOne({ token: refresh_token });
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: new_refresh_token,
        user_id: new ObjectId(user_id),
        exp,
        iat
      })
    );
    return { access_token, refresh_token: new_refresh_token };
  }

  async order(req: OrderReqBody) {
    const _id = new ObjectId();
    //tìm tên villa
    const villaTimeShare = await databaseService.villaTimeShares.findOne({
      _id: new ObjectId(req.villa_time_share_id)
    });
    if (!villaTimeShare)
      throw new ErrorWithStatus({ message: 'Villa time share not found', status: HTTP_STATUS.NOT_FOUND });
    if (villaTimeShare.user_id)
      throw new ErrorWithStatus({
        message: 'Villa time share is paid by another user',
        status: HTTP_STATUS.BAD_REQUEST
      });
    const villa = await databaseService.villas.findOne({ _id: villaTimeShare.villa_id });
    if (!villa) throw new ErrorWithStatus({ message: 'Villa not found', status: HTTP_STATUS.NOT_FOUND });
    //create new order
    const newOrder = await databaseService.orders.insertOne(
      new Order({
        _id,
        ...req,
        order_name: `${villa.villa_name}`,
        price: req.price,
        status: OrderStatus.PENDING,
        villa_time_share_id: new ObjectId(req.villa_time_share_id),
        user_id: new ObjectId(req.user_id)
      })
    );
    const order = await databaseService.orders.findOne({ _id: new ObjectId(newOrder.insertedId) });
    return order;
  }

  async payment(req: PaymentReqBody) {
    const _id = new ObjectId();
    const order = await this.getOrderById(req.order_id);
    //tạo payment
    const payment = await databaseService.payments.insertOne(
      new Payment({
        ...req,
        _id,
        order_id: order._id,
        status: PaymentStatus.PENDING
      })
    );
    const newPayment = await databaseService.payments.findOne({ _id: new ObjectId(payment.insertedId) });
    return newPayment;
  }

  async confirmPayment({ order_id, payment_id }: { order_id: string; payment_id: string }) {
    const order = await this.getOrderById(order_id);
    await databaseService.orders.updateOne(
      {
        _id: order._id
      },
      [
        {
          $set: {
            status: OrderStatus.CONFIRMED,
            payment_id: new ObjectId(payment_id),
            update_date: '$$NOW'
          }
        }
      ]
    );
    await databaseService.payments.updateOne(
      {
        _id: new ObjectId(payment_id)
      },
      [
        {
          $set: {
            status: PaymentStatus.PAID,
            update_date: '$$NOW'
          }
        }
      ]
    );
    //cập nhật villa time share
    const villaTimeShare = await databaseService.villaTimeShares.findOne({ _id: order.villa_time_share_id });
    if (!villaTimeShare)
      throw new ErrorWithStatus({
        message: 'Villa time share not found',
        status: HTTP_STATUS.NOT_FOUND
      });
    await databaseService.villaTimeShares.updateOne(
      {
        _id: new ObjectId(villaTimeShare._id)
      },
      [
        {
          $set: {
            user_id: new ObjectId(order.user_id),
            update_date: '$$NOW'
          }
        }
      ]
    );
    return { message: USERS_MESSAGES.CONFIRM_PAYMENT_SUCCESS };
  }

  async createBlog(req: CreateBlogReqBody) {
    const user = await this.getUserById(req.user_id);
    const _id = new ObjectId();
    //tạo mới 1 blog
    const result = await databaseService.blogPosts.insertOne(
      new BlogPost({
        ...req,
        _id,
        user_id: user._id
      })
    );
    const blog = await databaseService.blogPosts.findOne({ _id: new ObjectId(result.insertedId) });
    return blog;
  }

  async createContract(req: CreateContractReqBody) {
    const _id = new ObjectId();
    //tạo mới 1 contract
    const result = await databaseService.contracts.insertOne(
      new Contract({
        ...req,
        _id,
        insert_date: new Date(),
        update_date: new Date(),
        order_id: new ObjectId(req.order_id)
      })
    );
    const contract = await databaseService.contracts.findOne({ _id: new ObjectId(result.insertedId) });
    return contract;
  }

  async getAllOrder() {
    const result = await databaseService.orders.find({}).toArray();
    return result;
  }

  async updateOrder(id: string, req: updateOrderReqBody) {
    //cập nhật order
    const order = await this.getOrderById(id);
    if (!req.order_name) req.order_name = order.order_name;
    if (!req.price) req.price = order.price;
    if (!req.status) req.status = order.status;
    const result = await databaseService.orders.updateOne(
      {
        _id: new ObjectId(id)
      },
      [
        {
          $set: {
            ...req,
            update_date: '$$NOW'
          }
        }
      ]
    );

    return order;
  }

  async getAllContract() {
    const result = await databaseService.contracts.find({}).toArray();
    return result;
  }

  async changePassword(
    user_id: string,
    {
      old_password,
      new_password,
      confirm_password
    }: {
      old_password: string;
      new_password: string;
      confirm_password: string;
    }
  ) {
    const user = await this.getUserById(user_id);
    if (user.password !== hashPassword(old_password)) {
      throw new ErrorWithStatus({
        message: 'Old password is incorrect',
        status: HTTP_STATUS.BAD_REQUEST
      });
    }
    if (new_password !== confirm_password)
      throw new ErrorWithStatus({
        message: 'New password and confirm password not match',
        status: HTTP_STATUS.BAD_REQUEST
      });
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            password: hashPassword(new_password),
            update_date: '$$NOW'
          }
        }
      ]
    );
    return { message: 'Change password success' };
  }

  async getContractById(id: string) {
    const contract = await databaseService.contracts.findOne({ _id: new ObjectId(id) });
    if (!contract) throw new ErrorWithStatus({ message: 'Contract not found', status: HTTP_STATUS.NOT_FOUND });
    return contract;
  }

  async updateContract(id: string, req: updateContractReqBody) {
    const contract = await this.getContractById(id);
    //nếu sign_contract không có thì gán giá trị thì giữ nguyên
    if (!req.sign_contract) req.sign_contract = contract.sign_contract;
    const result = await databaseService.contracts.updateOne(
      {
        _id: new ObjectId(id)
      },
      [
        {
          $set: {
            ...req,
            update_date: '$$NOW'
          }
        }
      ]
    );
    return contract;
  }

  async deleteContract(id: string) {
    const constract = await this.getContractById(id);
    const result = await databaseService.contracts.updateOne(
      {
        _id: new ObjectId(id)
      },
      [
        {
          $set: {
            deflag: true,
            update_date: '$$NOW'
          }
        }
      ]
    );
    return constract ? result.upsertedId : null;
  }

  async getOrderById(id: string) {
    const order = await databaseService.orders.findOne({ _id: new ObjectId(id) });
    if (!order) throw new ErrorWithStatus({ message: 'Order not found', status: HTTP_STATUS.NOT_FOUND });
    return order;
  }
  async getAllBlogPosts() {
    const result = await databaseService.blogPosts
      .find({
        deflag: false
      })
      .toArray();
    return result;
  }

  async deleteBlogPost(id: string) {
    const blogPost = await databaseService.blogPosts.findOne({ _id: new ObjectId(id) });
    const result = await databaseService.blogPosts.updateOne(
      {
        _id: new ObjectId(id)
      },
      [
        {
          $set: {
            deflag: true,
            update_date: '$$NOW'
          }
        }
      ]
    );
    return blogPost ? result.upsertedId : null;
  }
  async getUserOwnVilla(user_id: string) {
    const user = this.getUserById(user_id);
    const villaTimeShares = await databaseService.villaTimeShares.find({ user_id: new ObjectId(user_id) }).toArray();
    //tìm villa của user
    const villas = await Promise.all(
      villaTimeShares.map(async (villaTimeShare) => {
        return await databaseService.villas.findOne({ _id: villaTimeShare.villa_id });
      })
    );
    return villas ? villas : null;
  }
}
const usersService = new UsersServices();
export default usersService;
