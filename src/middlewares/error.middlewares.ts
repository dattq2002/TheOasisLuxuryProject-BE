import { NextFunction, Request, Response } from 'express';
import { omit } from 'lodash';
import HTTP_STATUS from '~/constants/httpStatus';
import { ErrorWithStatus } from '~/models/Error';

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  //đây là nơi mà tất cả lỗi trên hệ thống sẽ dồn về
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']));
  }
  //nếu ko lọt vào if ở trên thì tức là err này là lỗi mặc định
  //name, message, stack mà 3 thằng nào có enumberable = false thì sẽ được trả về
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true });
  });
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfor: omit(err, ['stack'])
  });
};
