import { Router } from 'express';
import {
  emailVerifyController,
  forgotPasswordController,
  getUserByIdController,
  loginController,
  logoutController,
  refreshController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  updateUserByIdController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controller';
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/user.middleware';
import { wrapAsync } from '~/utils/handlers';

const usersRouter = Router();

usersRouter.post('/register', registerValidator, wrapAsync(registerController));

usersRouter.get('/:id', accessTokenValidator, wrapAsync(getUserByIdController));

usersRouter.post('/login', loginValidator, wrapAsync(loginController));

//update profile
usersRouter.patch('/:id', accessTokenValidator, wrapAsync(updateUserByIdController));

usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController));

usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyController));

usersRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyController));

usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController));

usersRouter.post(
  '/verify-forgot-password-token',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
);

usersRouter.post(
  '/reset-password',
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator,
  wrapAsync(resetPasswordController)
);

usersRouter.post('/refresh-token', refreshTokenValidator, wrapAsync(refreshController));

// usersRouter.post('/order', accessTokenValidator);

//------------------------------------------------------------

export default usersRouter;
