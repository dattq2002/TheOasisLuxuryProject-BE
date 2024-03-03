import { Router } from 'express';
import {
  changePasswordController,
  confirmPaymentController,
  createBlogController,
  createContractController,
  emailVerifyController,
  forgotPasswordController,
  getAllContractController,
  getAllOrderController,
  getUserByIdController,
  loginController,
  logoutController,
  orderController,
  paymentController,
  refreshController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  updateUserByIdController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controller';
import {
  accessTokenValidator,
  changePasswordValidator,
  confirmPaymentValidator,
  createBlogValidator,
  createContractValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  orderValidator,
  paymentValidator,
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

usersRouter.get('/verify-email/:token', emailVerifyTokenValidator, wrapAsync(emailVerifyController));

usersRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyController));

usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController));

usersRouter.get(
  '/verify-forgot-password-token/:token',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
);

usersRouter.post(
  '/reset-password',
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator,
  wrapAsync(resetPasswordController)
);

usersRouter.post(
  '/change-password',
  accessTokenValidator,
  changePasswordValidator,
  wrapAsync(changePasswordController)
);

usersRouter.post('/refresh-token', refreshTokenValidator, wrapAsync(refreshController));

usersRouter.post('/order', accessTokenValidator, orderValidator, wrapAsync(orderController));

usersRouter.post('/payment', accessTokenValidator, paymentValidator, wrapAsync(paymentController));

usersRouter.post(
  '/confirm-payment',
  accessTokenValidator,
  confirmPaymentValidator,
  wrapAsync(confirmPaymentController)
);

usersRouter.post('/create-blog', accessTokenValidator, createBlogValidator, wrapAsync(createBlogController));

usersRouter.post(
  '/create-contract',
  accessTokenValidator,

  wrapAsync(createContractController)
);

//------------------------------------------------------------

export default usersRouter;
