import { Router } from 'express';
import {
  createSubdivisionController,
  deleteSubdivisionController,
  getSubdivisionByIdController,
  getSubdivisionController,
  updateSubdivisionController
} from '~/controllers/subdivisions.controller';
import { accessTokenValidator } from '~/middlewares/user.middlewares';
import { wrapAsync } from '~/utils/handlers';

const subdivisionRouter = Router();

subdivisionRouter.get('/', accessTokenValidator, getSubdivisionController);

subdivisionRouter.get('/:id', accessTokenValidator, getSubdivisionByIdController);

subdivisionRouter.post('/', accessTokenValidator, wrapAsync(createSubdivisionController));

subdivisionRouter.patch('/:id', accessTokenValidator, wrapAsync(updateSubdivisionController));

subdivisionRouter.delete('/:id', accessTokenValidator, wrapAsync(deleteSubdivisionController));

export default subdivisionRouter;
