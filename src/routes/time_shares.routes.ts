import { Router } from 'express';
import {
  createTimeShareController,
  deleteTimeShareController,
  getTimeShareByIdController,
  getTimeShareController,
  updateTimeShareController
} from '~/controllers/time_shares.controller';
import { wrapAsync } from '~/utils/handlers';

const timeSharesRouter = Router();

timeSharesRouter.get('/', getTimeShareController);

timeSharesRouter.get('/:id', getTimeShareByIdController);

timeSharesRouter.post('/', wrapAsync(createTimeShareController));

timeSharesRouter.patch('/:id', wrapAsync(updateTimeShareController));

timeSharesRouter.delete('/:id', deleteTimeShareController);

export default timeSharesRouter;
