import { Request, Response } from 'express';
import { USERS_MESSAGES } from '~/constants/message';
import { ParamsDictionary } from 'express-serve-static-core';
import usersService from '~/services/users.services';
import {
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  TokenPayload,
  UpdateUserReqBody,
  VerifyEmailReqBody
} from '~/models/requests/register.request';
import User from '~/models/schemas/User.schemas';
import { ObjectId } from 'mongodb';
import { RoleName, UserVerifyStatus } from '~/constants/enum';
import databaseService from '~/services/database.services';
import { hashPassword } from '~/utils/helpers';

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

export const emailVerifyController = async (req: Request<ParamsDictionary, any, VerifyEmailReqBody>, res: Response) => {
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
