import { ParamSchema, checkSchema } from 'express-validator';
import { AccountStatus, GenderType } from '~/constants/enum';
import { USERS_MESSAGES } from '~/constants/message';
import usersService from '~/services/users.service';
import { validate } from '~/utils/validation';

const userName: ParamSchema = {
  notEmpty: {
    errorMessage: 'User name is required'
  },
  isString: {
    errorMessage: 'User name must be a string'
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 10
    },
    errorMessage: 'User name length must be from 1 to 10'
  }
};
export const accountValidator = validate(
  checkSchema(
    {
      user_name: userName,
      role_name: {
        notEmpty: {
          errorMessage: 'Role name is required'
        },
        isString: {
          errorMessage: 'Role name must be a string'
        },
        trim: true
      },
      birthday: {
        notEmpty: {
          errorMessage: 'Birthday is required'
        },
        isString: {
          errorMessage: 'Birthday must be a string'
        },
        trim: true
      },
      phone_number: {
        notEmpty: {
          errorMessage: 'Phone number is required'
        },
        isString: {
          errorMessage: 'Phone number must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 10
          },
          errorMessage: 'Phone number length must be from 1 to 10'
        }
      },
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
      }
    },
    ['body']
  )
);

export const updateAccountValidator = validate(
  checkSchema(
    {
      user_name: {
        isString: {
          errorMessage: 'User name must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 10
          },
          errorMessage: 'User name length must be from 1 to 10'
        }
      },
      role_name: {
        isString: {
          errorMessage: 'Role name must be a string'
        },
        trim: true
      },
      birthday: {
        isString: {
          errorMessage: 'Birthday must be a string'
        },
        trim: true
      },
      phone_number: {
        isString: {
          errorMessage: 'Phone number must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 10
          },
          errorMessage: 'Phone number length must be from 1 to 10'
        }
      },
      email: {
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
      gender: {
        isString: {
          errorMessage: 'Gender must be a string'
        },
        trim: true,
        isIn: {
          options: [[GenderType.FEMALE, GenderType.MALE, GenderType.OTHER]],
          errorMessage: 'Gender must be in type FEMALE, MALE, OTHER'
        }
      },
      url_image: {
        isString: {
          errorMessage: 'Url image must be a string'
        },
        trim: true
      },
      status: {
        isString: {
          errorMessage: 'Status must be a string'
        },
        trim: true,
        isIn: {
          options: [[AccountStatus.ACTIVE, AccountStatus.BAN, AccountStatus.INACTIVE]],
          errorMessage: 'Status must be in type active, inactive'
        }
      },
      tax_code: {
        isString: {
          errorMessage: 'Tax code must be a string'
        },
        trim: true
      },
      date_provide_CCCD: {
        isString: {
          errorMessage: 'Date provide CCCD must be a string'
        },
        trim: true
      },
      place_provide_CCCD: {
        isString: {
          errorMessage: 'Place provide CCCD must be a string'
        },
        trim: true
      }
    },
    ['body']
  )
);
