import { Router } from 'express';
import {
  createAccountController,
  deleteAccountController,
  getAccountController,
  updateAccountController
} from '~/controllers/accounts.controller';
import { getUserByIdController } from '~/controllers/users.controller';
import { accountValidator, updateAccountValidator } from '~/middlewares/accounts.middleware';
import { accessTokenValidator } from '~/middlewares/user.middleware';
import { wrapAsync } from '~/utils/handlers';

const accountRouter = Router();
//API dành cho admin, quản lý tài khoản
accountRouter.post('/', accessTokenValidator, accountValidator, wrapAsync(createAccountController));

accountRouter.patch('/:id', accessTokenValidator, updateAccountValidator, wrapAsync(updateAccountController));

accountRouter.get('/:id', accessTokenValidator, wrapAsync(getUserByIdController));

accountRouter.get('/', accessTokenValidator, wrapAsync(getAccountController));

accountRouter.delete('/:id', accessTokenValidator, wrapAsync(deleteAccountController));

export default accountRouter;
