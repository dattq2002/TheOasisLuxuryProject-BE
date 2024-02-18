import { ParamSchema, checkSchema } from 'express-validator';
import { ProjectStatus } from '~/constants/enum';
import { PROJECTS_MESSAGES } from '~/constants/message';
import { validate } from '~/utils/validation';

const dateSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: PROJECTS_MESSAGES.INVALID_DATE_FORMAT
  }
};
export const projectValidation = validate(
  checkSchema(
    {
      project_name: {
        trim: true,
        isString: true,
        isLength: {
          errorMessage: 'Project name should be at least 3 chars long',
          options: { min: 3, max: 50 }
        },
        isEmpty: {
          errorMessage: 'Project name is required'
        }
      },
      start_date: dateSchema,
      end_date: dateSchema,
      status: {
        isString: true,
        isIn: {
          options: [ProjectStatus.ACTIVE, ProjectStatus.INACTIVE],
          errorMessage: 'Invalid status'
        },
        isEmpty: {
          errorMessage: 'Status is required'
        },
        trim: true
      },
      description: {
        trim: true,
        isString: true,
        isLength: {
          errorMessage: 'Description should be at least 3 chars long',
          options: { min: 3, max: 200 }
        },
        isEmpty: {
          errorMessage: 'Description is required'
        }
      }
    },
    ['body']
  )
);
