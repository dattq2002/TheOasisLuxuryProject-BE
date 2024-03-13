import { Router } from 'express';
import {
  createAccountController,
  deleteAccountController,
  getAccountController,
  updateAccountController
} from '~/controllers/accounts.controller';
import { getUserByIdController } from '~/controllers/users.controller';
import { accountValidator, updateAccountValidator } from '~/middlewares/accounts.middleware';
import { checkRoleAdmin } from '~/middlewares/auth.middleware';
import { accessTokenValidator } from '~/middlewares/user.middleware';
import { wrapAsync } from '~/utils/handlers';

const accountRouter = Router();
//API dành cho admin, quản lý tài khoản
//create account staff
accountRouter.post('/', accessTokenValidator, checkRoleAdmin, wrapAsync(createAccountController));
//update account staff
accountRouter.patch('/:id', accessTokenValidator, checkRoleAdmin, wrapAsync(updateAccountController));
//get account staff by id
accountRouter.get('/:id', accessTokenValidator, checkRoleAdmin, wrapAsync(getUserByIdController));
//get all account staff/admin
accountRouter.get('/', accessTokenValidator, checkRoleAdmin, wrapAsync(getAccountController));
//delete account staff
accountRouter.delete('/:id', accessTokenValidator, checkRoleAdmin, wrapAsync(deleteAccountController));

export default accountRouter;
