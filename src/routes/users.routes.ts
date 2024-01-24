import { Router } from 'express';
import { registerController } from '~/controllers/users.controllers';
import { registerValidator } from '~/middlewares/user.middlewares';
import { wrapAsync } from '~/utils/handlers';

const usersRouter = Router();

usersRouter.post('/users/register', registerValidator, wrapAsync(registerController));

export default usersRouter;
