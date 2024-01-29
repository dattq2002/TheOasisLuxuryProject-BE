import { checkSchema } from 'express-validator';
import { USERS_MESSAGES } from '~/constants/message';
import usersService from '~/services/users.services';
import { validate } from '~/utils/validation';

export const accountValidator = validate(
  checkSchema(
    {
      user_name: {
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
            max: 100
          },
          errorMessage: 'User name length must be from 1 to 100'
        }
      },
      role_name: {
        notEmpty: {
          errorMessage: 'Role name is required'
        },
        isString: {
          errorMessage: 'Role name must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: 'Role name length must be from 1 to 100'
        }
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
