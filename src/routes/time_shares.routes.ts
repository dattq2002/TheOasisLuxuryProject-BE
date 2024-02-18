import { Router } from 'express';
import {
  createTimeShareController,
  deleteTimeShareController,
  getTimeShareByIdController,
  getTimeShareController,
  updateTimeShareController
} from '~/controllers/time_shares.controller';
import { time_sharesValidation } from '~/middlewares/timeshares.middleware';
import { accessTokenValidator } from '~/middlewares/user.middleware';
import { wrapAsync } from '~/utils/handlers';

const timeSharesRouter = Router();

timeSharesRouter.get('/', accessTokenValidator, getTimeShareController);

timeSharesRouter.get('/:id', accessTokenValidator, getTimeShareByIdController);

timeSharesRouter.post('/', accessTokenValidator, time_sharesValidation, wrapAsync(createTimeShareController));

timeSharesRouter.patch('/:id', accessTokenValidator, time_sharesValidation, wrapAsync(updateTimeShareController));

timeSharesRouter.delete('/:id', accessTokenValidator, deleteTimeShareController);

export default timeSharesRouter;
