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
accountRouter.post('/', accessTokenValidator, checkRoleAdmin, wrapAsync(createAccountController));

accountRouter.patch('/:id', accessTokenValidator, checkRoleAdmin, wrapAsync(updateAccountController));

accountRouter.get('/:id', accessTokenValidator, checkRoleAdmin, wrapAsync(getUserByIdController));

accountRouter.get('/', accessTokenValidator, checkRoleAdmin, wrapAsync(getAccountController));

accountRouter.delete('/:id', accessTokenValidator, checkRoleAdmin, wrapAsync(deleteAccountController));

export default accountRouter;
