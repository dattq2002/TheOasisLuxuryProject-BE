import { checkSchema } from 'express-validator';
import { VillaStatus } from '~/constants/enum';
import { validate } from '~/utils/validation';

export const createUtilitiesValidation = validate(
  checkSchema(
    {
      villa_name: {
        isString: true,
        notEmpty: {
          errorMessage: 'Name is required'
        },
        trim: true
      },
      status: {
        isString: true,
        notEmpty: {
          errorMessage: 'Status is required'
        },
        trim: true,
        isIn: {
          options: [VillaStatus.ACTIVE, VillaStatus.INACTIVE, VillaStatus.SOLD],
          errorMessage: 'Invalid status'
        }
      },
      address: {
        isString: true,
        notEmpty: {
          errorMessage: 'Address is required'
        },
        trim: true
      },
      area: {
        isString: true,
        notEmpty: {
          errorMessage: 'Area is required'
        },
        trim: true
      },
      url_image: {
        isArray: true,
        optional: true
      },
      fluctuates_price: {
        isNumeric: true,
        notEmpty: {
          errorMessage: 'Fluctuates price is required'
        }
      },
      stiff_price: {
        isNumeric: true,
        notEmpty: {
          errorMessage: 'Stiff price is required'
        }
      }
    },
    ['body']
  )
);
