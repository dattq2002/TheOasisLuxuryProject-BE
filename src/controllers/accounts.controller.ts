import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { RoleName } from '~/constants/enum';
import HTTP_STATUS from '~/constants/httpStatus';
import { USERS_MESSAGES } from '~/constants/message';
import { ErrorWithStatus } from '~/models/Error';
import { createAccountReq, updateAccountReq } from '~/models/requests/account.request';
import { TokenPayload } from '~/models/requests/user.request';
import usersService from '~/services/users.service';

export const createAccountController = async (req: Request<ParamsDictionary, any, createAccountReq>, res: Response) => {
  const result = await usersService.createAccount(req.body);
  return res.json({
    message: USERS_MESSAGES.CREATE_ACCOUNT_SUCCESS,
    result
  });
};

//update account dành cho admin by id
export const updateAccountController = async (req: Request<ParamsDictionary, any, updateAccountReq>, res: Response) => {
  const { id } = req.params;
  const result = await usersService.updateAccountById(id, req.body);
  return res.json({
    message: USERS_MESSAGES.UPDATE_ACCOUNT_SUCCESS,
    result
  });
};

//get account dành cho admin by id
export const getAccountController = async (req: Request, res: Response) => {
  const result = await usersService.getAccount();
  return res.json({
    message: USERS_MESSAGES.GET_ACCOUNT_SUCCESS,
    result
  });
};
export const deleteAccountController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await usersService.deleteAccountById(id);
  return res.json({
    message: USERS_MESSAGES.DELETE_ACCOUNT_SUCCESS,
    result
  });
};
