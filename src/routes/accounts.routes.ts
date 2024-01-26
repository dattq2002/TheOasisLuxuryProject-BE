import { Router } from 'express';
import {
  createAccountController,
  deleteAccountController,
  getAccountController,
  updateAccountController
} from '~/controllers/accounts.controller';
import { accountValidator } from '~/middlewares/accounts.middlewares';
import { wrapAsync } from '~/utils/handlers';

const accountRouter = Router();

accountRouter.post('/create-account', accountValidator, wrapAsync(createAccountController));

accountRouter.patch('/update-account/:id', accountValidator, wrapAsync(updateAccountController));

accountRouter.get('/get-account', wrapAsync(getAccountController));

accountRouter.delete('/delete-account/:id', wrapAsync(deleteAccountController));

export default accountRouter;
