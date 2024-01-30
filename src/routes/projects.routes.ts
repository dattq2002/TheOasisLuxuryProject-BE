import { Router } from 'express';
import {
  addSubdivisionToProjectController,
  createProjectController,
  deleteProjectController,
  getProjectByIdController,
  getProjectController,
  updateProjectController
} from '~/controllers/projects.controller';
import { accessTokenValidator } from '~/middlewares/user.middlewares';
import { wrapAsync } from '~/utils/handlers';

const projectRouter = Router();

projectRouter.get('/', accessTokenValidator, getProjectController);

projectRouter.get('/:id', accessTokenValidator, getProjectByIdController);

projectRouter.post('/', accessTokenValidator, wrapAsync(createProjectController));

projectRouter.patch('/:id', accessTokenValidator, wrapAsync(updateProjectController));

projectRouter.delete('/:id', accessTokenValidator, wrapAsync(deleteProjectController));

projectRouter.post('/:id/add-subdivision', accessTokenValidator, wrapAsync(addSubdivisionToProjectController));
export default projectRouter;
