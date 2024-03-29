import { Router } from 'express';
import {
  createSubdivisionController,
  deleteSubdivisionController,
  getSubdivisionByIdController,
  getSubdivisionByProjectIdController,
  getSubdivisionController,
  updateSubdivisionController
} from '~/controllers/subdivisions.controller';
import { subdivisionValidation, updateSubdivisionValidation } from '~/middlewares/subdivisions.middleware';
import { accessTokenValidator } from '~/middlewares/user.middleware';
import { wrapAsync } from '~/utils/handlers';

const subdivisionRouter = Router();

subdivisionRouter.get('/', wrapAsync(getSubdivisionController));

subdivisionRouter.get('/:id', wrapAsync(getSubdivisionByIdController));

subdivisionRouter.post('/', subdivisionValidation, wrapAsync(createSubdivisionController));

subdivisionRouter.patch('/:id', updateSubdivisionValidation, wrapAsync(updateSubdivisionController));

subdivisionRouter.delete('/:id', wrapAsync(deleteSubdivisionController));

subdivisionRouter.get('/projects/:projectId', wrapAsync(getSubdivisionByProjectIdController));

export default subdivisionRouter;
