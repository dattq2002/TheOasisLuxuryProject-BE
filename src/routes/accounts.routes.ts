import { Router } from 'express';
import {
  createAccountController,
  deleteAccountController,
  getAccountController,
  updateAccountController
} from '~/controllers/accounts.controller';
import { getUserByIdController } from '~/controllers/users.controllers';
import { accountValidator, updateAccountValidator } from '~/middlewares/accounts.middlewares';
import { accessTokenValidator } from '~/middlewares/user.middlewares';
import { wrapAsync } from '~/utils/handlers';

const accountRouter = Router();
//API dành cho admin, quản lý tài khoản
accountRouter.post('/', accessTokenValidator, accountValidator, wrapAsync(createAccountController));

accountRouter.patch('/:id', accessTokenValidator, updateAccountValidator, wrapAsync(updateAccountController));

accountRouter.get('/:id', accessTokenValidator, wrapAsync(getUserByIdController));

accountRouter.get('/', accessTokenValidator, wrapAsync(getAccountController));

accountRouter.delete('/:id', accessTokenValidator, wrapAsync(deleteAccountController));

export default accountRouter;
