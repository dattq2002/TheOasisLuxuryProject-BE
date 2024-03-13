import { Request, Response } from 'express';
import { USERS_MESSAGES } from '~/constants/message';
import { ParamsDictionary } from 'express-serve-static-core';
import usersService from '~/services/users.service';
import {
  ConfirmPaymentReqBody,
  CreateBlogReqBody,
  CreateContractReqBody,
  ForgotPasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
  OrderReqBody,
  PaymentReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  ResetPasswordReqBodyMobile,
  TokenPayload,
  UpdateUserReqBody,
  VerifyEmailReqBody,
  VerifyForgotPasswordReqBody,
  VerifyOTPReqBody,
  changePasswordReqBody,
  confirmContractReqBody,
  sendEmailConfirmContractReqBody,
  updateContractReqBody,
  updateOrderReqBody
} from '~/models/requests/user.request';
import User from '~/models/schemas/User.schemas';
import { ObjectId } from 'mongodb';
import { RoleName, UserVerifyStatus } from '~/constants/enum';
import databaseService from '~/databases/database.service';
import { ErrorWithStatus } from '~/models/Error';
import HTTP_STATUS from '~/constants/httpStatus';

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body);

  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  });
};

export const getUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await usersService.getUserById(id);
  return res.json({
    message: USERS_MESSAGES.GET_USER_BY_ID_SUCCESS,
    user
  });
};

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  // nếu nó vào dc đây , tức là đã qua được các bước validate và đăng nhập thành công
  const user = req.user as User;
  const user_id = user._id as ObjectId;
  //server phải tạo ra access token và refresh token để đưa về cho client
  const result = await usersService.login({
    user_id: user_id.toString(),
    verify: user.verify ? UserVerifyStatus.Verified : UserVerifyStatus.Unverified
  }); //
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  });
};

export const updateUserByIdController = async (
  req: Request<ParamsDictionary, any, UpdateUserReqBody>,
  res: Response
) => {
  const { id } = req.params;

  const result = await usersService.updateUserProfileById(id, req.body);
  return res.json({
    message: USERS_MESSAGES.UPDATE_USER_SUCCESS,
    result
  });
};

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  //lấy refresh token từ req.body
  const { refresh_token } = req.body;
  //và vào db xoá cái refresh token đó đi
  const result = await usersService.logout(refresh_token);
  res.json(result);
};

export const emailVerifyController = async (req: Request, res: Response) => {
  //kiểm tra user này đã verify email chưa
  const { user_id } = req.decoded_email_verify_token as TokenPayload;
  const user = req.user as User;
  if (user.verify === UserVerifyStatus.Verified && user.email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    });
  }
  //nếu mà xuống dc đây nghĩa là user này chưa verify email, chưa bị banned, và khớp mã
  //mình tiến hành update lại trạng thái verify của user này
  const result = await usersService.verifyEmail(user_id);
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  });
};

export const resendEmailVerifyController = async (req: Request, res: Response) => {
  //nếu nó vào dc đây , tức là đã qua được các bước validate
  const { user_id } = req.decoded_authorization as TokenPayload;
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) });
  if (!user) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    });
  }
  //nếu có thì kiểm tra xem user đã bị banned chưa
  if (user.verify === UserVerifyStatus.Banned) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_BANNED,
      status: HTTP_STATUS.FORBIDDEN
    });
  }
  //user đã verify email chưa
  if (user.verify === UserVerifyStatus.Verified && user.email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    });
  }
  //nếu chưa verify email thì tiến hành gửi lại email verify token
  const result = await usersService.resendEmailVerify(user_id);
  return res.json({
    message: USERS_MESSAGES.RESEND_EMAIL_VERIFY_SUCCESS,
    result
  });
};

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response
) => {
  //middleware forgotPasswordValidator đã chạy rồi, nên ta có thể lấy _id từ user đã tìm đc bằng email
  const { _id, verify, email } = req.user as User;
  //cái _id này là objectid, nên ta phải chuyển nó về string
  //chứ không truyền trực tiếp vào hàm forgotPassword
  const result = await usersService.forgotPassword({
    user_id: (_id as ObjectId).toString(),
    verify,
    email
  });
  return res.json(result);
};

export const verifyForgotPasswordTokenController = async (req: Request, res: Response) => {
  //nếu đã đến bước này nghĩa là ta đã tìm có forgot_password_token hợp lệ
  //và đã lưu vào req.decoded_forgot_password_token
  //thông tin của user
  //ta chỉ cần thông báo rằng token hợp lệ
  return res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS
  });
};

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
) => {
  //muốn cập nhật mật khẩu mới thì cần user_id, và password mới
  const { user_id } = req.decoded_forgot_password_token as TokenPayload;
  const { password } = req.body;
  //cập nhật password mới cho user có user_id này
  const result = await usersService.resetPassword({
    user_id,
    password
  });
  return res.json(result);
};

export const refreshController = async (req: Request<ParamsDictionary, any, RefreshTokenReqBody>, res: Response) => {
  const { refresh_token } = req.body; //lấy refresh_token từ req.body
  const { user_id, verify, exp } = req.decoded_refresh_token as TokenPayload; //lấy user_id từ decoded_refresh_token của refresh_token
  const result = await usersService.refreshToken({
    user_id,
    refresh_token,
    verify,
    exp
  }); //chưa có method này
  return res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
    result
  });
};

export const orderController = async (req: Request<ParamsDictionary, any, OrderReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  if ((await usersService.getRole(user_id)) !== RoleName.USER) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  req.body.user_id = user_id;
  const result = await usersService.order(req.body);
  return res.json({
    message: USERS_MESSAGES.ORDER_SUCCESS,
    result
  });
};

export const paymentController = async (req: Request<ParamsDictionary, any, PaymentReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  if ((await usersService.getRole(user_id)) !== RoleName.USER) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  const result = await usersService.payment(req.body);
  return res.json(result);
};

export const confirmPaymentController = async (
  req: Request<ParamsDictionary, any, ConfirmPaymentReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  if ((await usersService.getRole(user_id)) !== RoleName.USER) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  const { payment_id, order_id } = req.body;
  const result = await usersService.confirmPayment({ payment_id, order_id });
  return res.json({
    message: USERS_MESSAGES.CONFIRM_PAYMENT_SUCCESS,
    result
  });
};

export const createBlogController = async (req: Request<ParamsDictionary, any, CreateBlogReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  if (![RoleName.ADMIN, RoleName.STAFF].includes(await usersService.getRole(user_id))) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  const result = await usersService.createBlog(req.body);
  return res.json({
    message: USERS_MESSAGES.CREATE_BLOG_SUCCESS,
    result
  });
};

export const createContractController = async (
  req: Request<ParamsDictionary, any, CreateContractReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  if ((await usersService.getRole(user_id)) !== RoleName.USER) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  const result = await usersService.createContract(req.body);
  return res.json(result);
};

export const getAllOrderController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  if ((await usersService.getRole(user_id)) !== RoleName.ADMIN) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  const result = await usersService.getAllOrder();
  return res.json({
    message: USERS_MESSAGES.GET_ALL_ORDER_SUCCESS,
    result
  });
};

export const updateOrderController = async (req: Request<ParamsDictionary, any, updateOrderReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { id } = req.params;
  if (![RoleName.ADMIN, RoleName.USER].includes(await usersService.getRole(user_id))) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  const { status, price, order_name } = req.body;
  const result = await usersService.updateOrder(id, { status, order_name, price });
  return res.json({
    message: USERS_MESSAGES.UPDATE_ORDER_SUCCESS,
    result
  });
};

export const getAllContractController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  if (![RoleName.ADMIN, RoleName.STAFF].includes(await usersService.getRole(user_id))) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  const result = await usersService.getAllContract();
  return res.json({
    message: USERS_MESSAGES.GET_ALL_CONTRACT_SUCCESS,
    result
  });
};

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, changePasswordReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { old_password, new_password, confirm_password } = req.body as changePasswordReqBody;
  const result = await usersService.changePassword(user_id, { old_password, new_password, confirm_password });
  return res.json(result);
};

export const getContractByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await usersService.getContractById(id);
  return res.json(result);
};

export const updateContractController = async (
  req: Request<ParamsDictionary, any, updateContractReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { id } = req.params;
  const result = await usersService.updateContract(id, req.body);
  return res.json(result);
};

export const deleteContractController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { id } = req.params;
  if (![RoleName.ADMIN, RoleName.STAFF].includes(await usersService.getRole(user_id))) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  const result = await usersService.deleteContract(id);
  return res.json(result);
};

export const getOrderByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await usersService.getOrderById(id);
  return res.json(result);
};

export const getAllBlogPostsController = async (req: Request, res: Response) => {
  const result = await usersService.getAllBlogPosts();
  return res.json({
    message: USERS_MESSAGES.GET_ALL_BLOG_POST_SUCCESS,
    result
  });
};

export const deleteBlogPostController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { id } = req.params;
  if (![RoleName.ADMIN, RoleName.STAFF].includes(await usersService.getRole(user_id))) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  const result = await usersService.deleteBlogPost(id);
  return res.json(result);
};

export const getUserOwnVillaController = async (req: Request, res: Response) => {
  const user_id = req.params.userID;
  const result = await usersService.getUserOwnVilla(user_id);
  return res.json({
    message: USERS_MESSAGES.GET_USER_OWN_VILLA_SUCCESS,
    result
  });
};

export const confirmContractController = async (
  req: Request<ParamsDictionary, any, confirmContractReqBody>,
  res: Response
) => {
  const { constractId } = req.params;
  const result = await usersService.confirmContract(constractId, req.body.status);
  return res.json({
    message: USERS_MESSAGES.CONFIRM_CONTRACT_SUCCESS,
    result
  });
};

export const forgotPasswordMobileController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response
) => {
  const { email } = req.body;
  const result = await usersService.forgotPasswordMobile(email);
  return res.json(result);
};

export const verifyOTPController = async (req: Request<ParamsDictionary, any, VerifyOTPReqBody>, res: Response) => {
  const { otp, email } = req.body;
  const result = await usersService.verifyOTP(email, otp);
  return res.json(result);
};

export const resetPasswordMobileController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBodyMobile>,
  res: Response
) => {
  const { email, password, confirm_password } = req.body;
  const result = await usersService.resetPasswordMobile({ email, password, confirm_password });
  return res.json(result);
};

export const getAllPaymentController = async (req: Request, res: Response) => {
  const result = await usersService.getAllPayment();
  return res.json({
    message: USERS_MESSAGES.GET_ALL_PAYMENT_SUCCESS,
    result
  });
};

export const deleteOrderController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await usersService.deleteOrder(id);
  return res.json(result);
};

export const getPaymentByOrderIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await usersService.getPaymentByOrderId(id);
  return res.json(result);
};

export const sendEmailConfirmContractController = async (
  req: Request<ParamsDictionary, any, sendEmailConfirmContractReqBody>,
  res: Response
) => {
  const { contractId } = req.params;
  const { text } = req.body;
  const result = await usersService.sendEmailConfirmContract(contractId, text);
  return res.json(result);
};
