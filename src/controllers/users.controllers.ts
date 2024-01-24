import { Request, Response } from 'express';
import { USERS_MESSAGES } from '~/constants/message';
import { ParamsDictionary } from 'express-serve-static-core';
import usersService from '~/services/users.services';
import { RegisterReqBody } from '~/models/requests/register.request';

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body);

  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  });
};
