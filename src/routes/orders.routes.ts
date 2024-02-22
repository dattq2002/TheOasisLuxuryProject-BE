import { Router } from 'express';
import { getAllOrderController, updateOrderController } from '~/controllers/users.controller';
import { accessTokenValidator } from '~/middlewares/user.middleware';
import { wrapAsync } from '~/utils/handlers';

const ordersRouter = Router();

ordersRouter.get('/', accessTokenValidator, getAllOrderController);

ordersRouter.patch('/:id', accessTokenValidator, wrapAsync(updateOrderController));

export default ordersRouter;
