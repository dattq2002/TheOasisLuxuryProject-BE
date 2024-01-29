import { Router } from 'express';
import {
  getUserByIdController,
  loginController,
  logoutController,
  registerController,
  updateUserByIdController
} from '~/controllers/users.controllers';
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/user.middlewares';
import { wrapAsync } from '~/utils/handlers';

const usersRouter = Router();

usersRouter.post('/register', registerValidator, wrapAsync(registerController));

usersRouter.get('/:id', accessTokenValidator, wrapAsync(getUserByIdController));

usersRouter.post('/login', loginValidator, wrapAsync(loginController));

usersRouter.patch('/:id', accessTokenValidator, wrapAsync(updateUserByIdController));

usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController));

export default usersRouter;
