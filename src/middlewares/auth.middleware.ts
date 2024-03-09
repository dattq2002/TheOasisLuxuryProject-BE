import { NextFunction, Request, Response } from 'express';
import { RoleName } from '~/constants/enum';
import HTTP_STATUS from '~/constants/httpStatus';
import { USERS_MESSAGES } from '~/constants/message';
import { ErrorWithStatus } from '~/models/Error';
import { TokenPayload } from '~/models/requests/user.request';
import usersService from '~/services/users.service';

export const checkRoleAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  if ((await usersService.getRole(user_id)) !== RoleName.ADMIN) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  next();
};

export const checkRoleUser = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  if ((await usersService.getRole(user_id)) !== RoleName.USER) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  next();
};

export const checkRoleStaff = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  if ((await usersService.getRole(user_id)) !== RoleName.STAFF) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  next();
};

export const checkRoleAdminOrStaff = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  if ([RoleName.ADMIN, RoleName.STAFF].includes(await usersService.getRole(user_id))) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  next();
};
