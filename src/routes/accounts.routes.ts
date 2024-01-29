import { Router } from 'express';
import {
  createAccountController,
  deleteAccountController,
  getAccountController,
  updateAccountController
} from '~/controllers/accounts.controller';
import { accountValidator } from '~/middlewares/accounts.middlewares';
import { accessTokenValidator } from '~/middlewares/user.middlewares';
import { wrapAsync } from '~/utils/handlers';

const accountRouter = Router();
//API dành cho admin
accountRouter.post('/', accessTokenValidator, accountValidator, wrapAsync(createAccountController));

accountRouter.patch('/:id', accessTokenValidator, accountValidator, wrapAsync(updateAccountController));

accountRouter.get('/', accessTokenValidator, wrapAsync(getAccountController));

accountRouter.delete('/:id', accessTokenValidator, wrapAsync(deleteAccountController));

export default accountRouter;
