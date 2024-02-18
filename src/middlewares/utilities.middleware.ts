import { checkSchema } from 'express-validator';
import { validate } from '~/utils/validation';

export const createUtilitiesValidation = validate(
  checkSchema(
    {
      utilities_name: {
        isString: true,
        notEmpty: {
          errorMessage: 'Name is required'
        },
        trim: true
      }
    },
    ['body']
  )
);
