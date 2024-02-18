import { checkSchema } from 'express-validator';
import { SubdivisionStatus } from '~/constants/enum';
import { validate } from '~/utils/validation';

export const subdivisionValidation = validate(
  checkSchema(
    {
      subdivision_name: {
        trim: true,
        isString: true,
        isLength: {
          errorMessage: 'Subdivision name should be at least 3 chars long',
          options: { min: 3, max: 50 }
        },
        isEmpty: {
          errorMessage: 'Subdivision name is required'
        }
      },
      location: {
        trim: true,
        isString: true,
        isLength: {
          errorMessage: 'Location should be at least 3 chars long',
          options: { min: 3, max: 50 }
        },
        isEmpty: {
          errorMessage: 'Location is required'
        }
      },
      quantityVilla: {
        isNumeric: {
          errorMessage: 'Quantity villa should be a number'
        }
      },
      status: {
        isString: true,
        isEmpty: {
          errorMessage: 'Status is required'
        },
        trim: true,
        isIn: {
          options: [SubdivisionStatus.ACTIVE, SubdivisionStatus.INACTIVE]
        }
      },
      project_id: {
        isString: true,
        isEmpty: {
          errorMessage: 'Project id is required'
        },
        trim: true
      }
    },
    ['body']
  )
);

export const updateSubdivisionValidation = validate(
  checkSchema(
    {
      subdivision_name: {
        trim: true,
        isString: true,
        isLength: {
          errorMessage: 'Subdivision name should be at least 3 chars long',
          options: { min: 3, max: 50 }
        },
        isEmpty: {
          errorMessage: 'Subdivision name is required'
        }
      },
      location: {
        trim: true,
        isString: true,
        isLength: {
          errorMessage: 'Location should be at least 3 chars long',
          options: { min: 3, max: 50 }
        },
        isEmpty: {
          errorMessage: 'Location is required'
        }
      },
      quantityVilla: {
        isNumeric: {
          errorMessage: 'Quantity villa should be a number'
        }
      },
      status: {
        isString: true,
        isEmpty: {
          errorMessage: 'Status is required'
        },
        trim: true,
        isIn: {
          options: [SubdivisionStatus.ACTIVE, SubdivisionStatus.INACTIVE]
        }
      }
    },
    ['body']
  )
);
