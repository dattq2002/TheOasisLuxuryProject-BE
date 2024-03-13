import { NextFunction, Request } from 'express';
import { ParamSchema, checkSchema } from 'express-validator';
import { JsonWebTokenError } from 'jsonwebtoken';
import { capitalize } from 'lodash';
import { ObjectId } from 'mongodb';
import { ContractStatus, OrderStatus, PaymentType, RoleName, UserVerifyStatus } from '~/constants/enum';
import HTTP_STATUS from '~/constants/httpStatus';
import { USERS_MESSAGES } from '~/constants/message';
import { ErrorWithStatus } from '~/models/Error';
import { TokenPayload } from '~/models/requests/user.request';
import databaseService from '~/databases/database.service';
import usersService from '~/services/users.service';
import { hashPassword } from '~/utils/helpers';
import { verifyToken } from '~/utils/jwt';
import { validate } from '~/utils/validation';

const nameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 100
    },
    errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
  }
};

const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 8,
      max: 50
    },
    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
  },
  isStrongPassword: {
    options: {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
  }
};

const confirmPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 8,
      max: 50
    },
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
  },
  isStrongPassword: {
    options: {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD);
      }
      return true;
    }
  }
};
const dateOfBirthSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_BE_ISO8601
  }
};
export const registerValidator = validate(
  checkSchema(
    {
      full_name: nameSchema,
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        trim: true,
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const isExsit = await usersService.checkEmailExists(value);
            if (isExsit) {
              throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS);
            }
            return true;
          }
        }
      },
      password: passwordSchema,
      confirm_password: confirmPasswordSchema,
      birthday: dateOfBirthSchema,
      phone_number: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PHONE_NUMBER_IS_REQUIRED
        },
        trim: true
      }
    },
    ['body']
  )
);

export const loginValidator = validate(
  checkSchema(
    {
      user_name: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.USER_NAME_IS_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            //tìm user nào có email và password giống client gửi lên không
            const user = await databaseService.users.findOne({
              user_name: value,
              password: hashPassword(req.body.password)
            });
            if (user === null) {
              throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT);
            }
            req.user = user; //req giữ giùm cái user này nhé
            return true;
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        }
      }
    },
    ['body']
  )
);

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const accessToken = value.split(' ')[1];
            if (!accessToken) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              });
            }
            //nếu xuống dc đây thì có nghĩa là có access token
            //cần verify access token và lấy payload() ra lưu lại trong req
            try {
              const decoded_authorization = await verifyToken({
                token: accessToken,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              });
              //; quan trọng
              (req as Request).decoded_authorization = decoded_authorization;
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: HTTP_STATUS.UNAUTHORIZED
              });
            }
            return true;
          }
        }
      }
    },
    ['headers']
  )
);

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
                databaseService.refreshTokens.findOne({
                  token: value
                })
              ]);
              if (refresh_token === null) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                  status: HTTP_STATUS.UNAUTHORIZED
                });
              }
              (req as Request).decoded_refresh_token = decoded_refresh_token;
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize((error as JsonWebTokenError).message),
                  status: HTTP_STATUS.UNAUTHORIZED
                });
              }
              throw error;
            }
            return true;
          }
        }
      }
    },
    ['body']
  )
);

export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            // nếu ko truyền email_verify_token lên thì sẽ báo lỗi
            if (!req.params) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              });
            }
            try {
              //verify token này để lấy decoded_email_verify_token
              const decoded_email_verify_token = await verifyToken({
                token: req.params.token as string,
                secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
              });

              // lưu cái decoded_email_verify_token này vào req
              (req as Request).decoded_email_verify_token = decoded_email_verify_token;
              //lấy cái user_id từ cái decoded_email_verify_token này để tìm user sở hữu
              const user_id = decoded_email_verify_token.user_id;
              //tìm user sở hữu cái email_verify_token này
              const user = await databaseService.users.findOne({
                _id: new ObjectId(user_id)
              });
              if (!user) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USER_NOT_FOUND,
                  status: HTTP_STATUS.NOT_FOUND
                });
              }
              //nếu có user thì xem thử user đó có bị banned
              req.user = user; //lưu lại để sử dụng
              if (user.verify === UserVerifyStatus.Banned) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USER_BANNED,
                  status: HTTP_STATUS.FORBIDDEN
                });
              }
              //nếu truyền lên ko đúng với database thì báo lỗi
              if (user.verify != UserVerifyStatus.Verified && req.params.token !== user.email_verify_token) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_NOT_MATCH,
                  status: HTTP_STATUS.UNAUTHORIZED
                });
              }
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize((error as JsonWebTokenError).message),
                  status: HTTP_STATUS.UNAUTHORIZED
                });
              }
              throw error;
            }
            return true;
          }
        }
      }
    },
    ['params']
  )
);

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            //tìm trong database xem có user nào sở hữu email = value của email người dùng gữi lên không
            const user = await databaseService.users.findOne({
              email: value
            });
            //nếu không tìm đc user thì nói user không tồn tại
            //khỏi tiến vào controller nữa
            if (!user) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              });
            }
            //đến đâu thì oke
            req.user = user; // lưu user mới tìm đc lại luôn, khi nào cần thì xài
            return true;
          }
        }
      }
    },
    ['body']
  )
);

export const verifyForgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_password_token: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            //nếu k truyền lên forgot_password_token thì ta sẽ throw error
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED //401
              });
            }
            //vào messages.ts thêm  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required'
            //nếu có thì decode nó để lấy đc thông tin của người dùng
            try {
              const decoded_forgot_password_token = await verifyToken({
                token: value.token as string,
                secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
              });
              //lưu decoded_forgot_password_token vào req để khi nào muốn biết ai gữi req thì dùng
              (req as Request).decoded_forgot_password_token = decoded_forgot_password_token;
              //vào type.d.ts thêm decoded_forgot_password_token?: TokenPayload cho Request
              //dùng user_id trong decoded_forgot_password_token để tìm user trong database
              //sẽ nhanh hơn là dùng forgot_password_token(value) để tìm user trong database
              const { user_id } = decoded_forgot_password_token;
              const user = await databaseService.users.findOne({
                _id: new ObjectId(user_id)
              });
              //nếu k tìm đc user thì throw error
              if (user === null) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USER_NOT_FOUND,
                  status: HTTP_STATUS.UNAUTHORIZED //401
                });
              }
              //nếu forgot_password_token đã được sử dụng rồi thì throw error
              //forgot_password_token truyền lên khác với forgot_password_token trong database
              //nghĩa là người dùng đã sử dụng forgot_password_token này rồi
              if (user.forgot_password_token !== value.token) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
                  status: HTTP_STATUS.UNAUTHORIZED //401
                });
              }
              //trong messages.ts thêm   INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token'
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize((error as JsonWebTokenError).message),
                  status: HTTP_STATUS.UNAUTHORIZED //401
                });
              }
              throw error;
            }
            return true;
          }
        }
      }
    },
    ['params']
  )
);

export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: passwordSchema,
      confirm_password: confirmPasswordSchema
    },
    ['body']
  )
);

export const orderValidator = validate(
  checkSchema(
    {
      user_id: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.USER_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.USER_ID_MUST_BE_A_STRING
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              _id: new ObjectId(value)
            });
            if (!user) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              });
            }
            if ([UserVerifyStatus.Banned, UserVerifyStatus.Unverified].includes(user.verify)) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.USER_NEED_TO_BE_VERIFIED,
                status: HTTP_STATUS.UNAUTHORIZED
              });
            }
            return true;
          }
        }
      },
      price: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PRICE_IS_REQUIRED
        },
        isNumeric: {
          errorMessage: USERS_MESSAGES.PRICE_MUST_BE_A_NUMBER
        }
      },
      start_date: dateOfBirthSchema
    },
    ['body']
  )
);

export const paymentValidator = validate(
  checkSchema(
    {
      payment_type: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PAYMENT_TYPE_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PAYMENT_TYPE_MUST_BE_A_STRING
        },
        trim: true,
        isIn: {
          options: [[PaymentType.CASH, PaymentType.CREDIT_CARD]],
          errorMessage: USERS_MESSAGES.PAYMENT_TYPE_IS_INVALID
        }
      },
      order_id: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.ORDER_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.ORDER_ID_MUST_BE_A_STRING
        },
        trim: true
      },
      amount: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.AMOUNT_IS_REQUIRED
        },
        isNumeric: {
          errorMessage: USERS_MESSAGES.AMOUNT_MUST_BE_A_NUMBER
        }
      }
    },
    ['body']
  )
);

export const confirmPaymentValidator = validate(
  checkSchema(
    {
      payment_id: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PAYMENT_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PAYMENT_ID_MUST_BE_A_STRING
        },
        trim: true
      },
      order_id: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.ORDER_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.ORDER_ID_MUST_BE_A_STRING
        },
        trim: true
      }
    },
    ['body']
  )
);

export const createBlogValidator = validate(
  checkSchema(
    {
      user_id: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.USER_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.USER_ID_MUST_BE_A_STRING
        },
        trim: true
      },
      title: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.TITLE_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.TITLE_MUST_BE_A_STRING
        },
        trim: true
      },
      description_detail: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.DESCRIPTION_DETAIL_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.DESCRIPTION_DETAIL_MUST_BE_A_STRING
        },
        trim: true
      }
    },
    ['body']
  )
);

export const createContractValidator = validate(
  checkSchema(
    {
      contract_name: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CONTRACT_NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.CONTRACT_NAME_MUST_BE_A_STRING
        },
        trim: true
      },
      url_image: {
        isString: {
          errorMessage: USERS_MESSAGES.URL_IMAGE_MUST_BE_A_STRING
        },
        trim: true
      },
      status: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.STATUS_IS_REQUIRED
        },
        trim: true,
        isIn: {
          options: [[ContractStatus.PENDING, ContractStatus.APPROVED, ContractStatus.REJECTED]],
          errorMessage: USERS_MESSAGES.STATUS_IS_WRONG_TYPE
        },
        isString: {
          errorMessage: USERS_MESSAGES.STATUS_MUST_BE_A_STRING
        }
      }
    },
    ['body']
  )
);

export const updateOrderVidator = validate(
  checkSchema(
    {
      status: {
        notEmpty: {
          errorMessage: 'Status is required !!'
        },
        trim: true,
        isIn: {
          options: [[OrderStatus.CANCELLED, OrderStatus.COMPLETED, OrderStatus.CONFIRMED, OrderStatus.PENDING]],
          errorMessage: 'Status is wrong type'
        },
        isString: true
      },
      // },
      // price: {
      //   isNumeric: true
      // },
      order_name: {
        trim: true,
        isString: true
      }
    },
    ['body']
  )
);

export const checkRoleAdminAccess = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  if ((await usersService.getRole(user_id)) !== RoleName.ADMIN) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  next();
};
export const checkRoleUserAccess = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  if ((await usersService.getRole(user_id)) !== RoleName.USER) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  next();
};
export const checkRoleStaffAccess = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  if ((await usersService.getRole(user_id)) !== RoleName.STAFF) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  next();
};
export const checkRoleAdminOrStaffAccess = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  if (![RoleName.ADMIN, RoleName.STAFF].includes(await usersService.getRole(user_id))) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_ACCESS,
      status: HTTP_STATUS.UNAUTHORIZED
    });
  }
  next();
};

export const changePasswordValidator = validate(
  checkSchema(
    {
      old_password: passwordSchema,
      new_password: passwordSchema,
      confirm_password: {
        trim: true,
        notEmpty: {
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
        },
        custom: {
          options: async (value, { req }) => {
            if (value !== req.body.new_password) {
              throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD);
            }
            return true;
          }
        }
      }
    },
    ['body']
  )
);
