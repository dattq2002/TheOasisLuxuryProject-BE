import { Router } from 'express';
import {
  createSubdivisionController,
  deleteSubdivisionController,
  getSubdivisionByIdController,
  getSubdivisionController,
  updateSubdivisionController
} from '~/controllers/subdivisions.controller';
import { wrapAsync } from '~/utils/handlers';

const subdivisionRouter = Router();

subdivisionRouter.get('/get-subdivision', getSubdivisionController);

subdivisionRouter.get('/get-subdivision/:id', getSubdivisionByIdController);

subdivisionRouter.post('/create-subdivision', wrapAsync(createSubdivisionController));

subdivisionRouter.patch('/update-subdivision/:id', wrapAsync(updateSubdivisionController));

subdivisionRouter.delete('/delete-subdivision/:id', wrapAsync(deleteSubdivisionController));

export default subdivisionRouter;
