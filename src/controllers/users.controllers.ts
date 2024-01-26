import { Request, Response } from 'express';
import { USERS_MESSAGES } from '~/constants/message';
import { ParamsDictionary } from 'express-serve-static-core';
import usersService from '~/services/users.services';
import { LoginReqBody, RegisterReqBody } from '~/models/requests/register.request';
import User from '~/models/schemas/User.schemas';
import { ObjectId } from 'mongodb';
import { UserVerifyStatus } from '~/constants/enum';
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
    verify: user.email_verify ? UserVerifyStatus.Verified : UserVerifyStatus.Unverified
  }); //
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  });
};
