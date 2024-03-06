import { checkSchema } from 'express-validator';
import { Time_ShareType } from '~/constants/enum';
import { validate } from '~/utils/validation';

export const time_sharesValidation = validate(
  checkSchema(
    {
      time_share_name: {
        isString: true,
        trim: true,
        isLength: {
          errorMessage: 'Time share name should be at least 3 chars long',
          options: { min: 3, max: 50 }
        },
        notEmpty: {
          errorMessage: 'Time share name is required'
        }
      },
      time_share_type: {
        isString: true,
        trim: true,
        notEmpty: {
          errorMessage: 'Time share type is required'
        },
        isIn: {
          options: [[Time_ShareType.MONTH, Time_ShareType.YEAR, Time_ShareType.DAY]],
          errorMessage: 'Invalid time share type'
        }
      },
      start_date: {
        isISO8601: true,
        notEmpty: {
          errorMessage: 'Start date is required'
        }
      },
      end_date: {
        isISO8601: true,
        notEmpty: {
          errorMessage: 'End date is required'
        }
      }
    },
    ['body']
  )
);
