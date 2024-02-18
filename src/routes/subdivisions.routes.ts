import { Router } from 'express';
import {
  createSubdivisionController,
  deleteSubdivisionController,
  getSubdivisionByIdController,
  getSubdivisionController,
  updateSubdivisionController
} from '~/controllers/subdivisions.controller';
import { subdivisionValidation, updateSubdivisionValidation } from '~/middlewares/subdivisions.middleware';
import { accessTokenValidator } from '~/middlewares/user.middleware';
import { wrapAsync } from '~/utils/handlers';

const subdivisionRouter = Router();

subdivisionRouter.get('/', accessTokenValidator, getSubdivisionController);

subdivisionRouter.get('/:id', accessTokenValidator, getSubdivisionByIdController);

subdivisionRouter.post('/', accessTokenValidator, subdivisionValidation, wrapAsync(createSubdivisionController));

subdivisionRouter.patch(
  '/:id',
  accessTokenValidator,
  updateSubdivisionValidation,
  wrapAsync(updateSubdivisionController)
);

subdivisionRouter.delete('/:id', accessTokenValidator, wrapAsync(deleteSubdivisionController));

export default subdivisionRouter;
