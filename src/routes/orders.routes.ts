import { Router } from 'express';
import {
  deleteOrderController,
  getAllOrderController,
  getOrderByIdController,
  updateOrderController
} from '~/controllers/users.controller';
import { accessTokenValidator, updateOrderVidator } from '~/middlewares/user.middleware';
import { wrapAsync } from '~/utils/handlers';

const ordersRouter = Router();

ordersRouter.get('/', accessTokenValidator, wrapAsync(getAllOrderController));

ordersRouter.patch('/:id', accessTokenValidator, updateOrderVidator, wrapAsync(updateOrderController));

ordersRouter.get('/:id', accessTokenValidator, wrapAsync(getOrderByIdController));

ordersRouter.delete('/:id', accessTokenValidator, wrapAsync(deleteOrderController));

export default ordersRouter;
