import { Router } from 'express';
import { getAllOrderController } from '~/controllers/users.controller';
import { accessTokenValidator } from '~/middlewares/user.middleware';

const ordersRouter = Router();

ordersRouter.get('/', accessTokenValidator, getAllOrderController);
export default ordersRouter;
