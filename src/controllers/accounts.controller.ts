import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { USERS_MESSAGES } from '~/constants/message';
import { createAccountReq, updateAccountReq } from '~/models/requests/account.request';
import { TokenPayload } from '~/models/requests/register.request';
import usersService from '~/services/users.services';
export const createAccountController = async (req: Request<ParamsDictionary, any, createAccountReq>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  if ((await usersService.getRole(user_id)) !== 'admin') {
    throw new Error(USERS_MESSAGES.USER_NOT_ACCESS);
  }
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
