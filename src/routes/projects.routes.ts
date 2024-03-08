import { Router } from 'express';
import {
  createProjectController,
  deleteProjectController,
  getProjectByIdController,
  getProjectController,
  updateProjectController
} from '~/controllers/projects.controller';
import { projectValidation } from '~/middlewares/projects.middleware';
import { accessTokenValidator } from '~/middlewares/user.middleware';
import { wrapAsync } from '~/utils/handlers';

const projectRouter = Router();

projectRouter.get('/', wrapAsync(getProjectController));

projectRouter.get('/:id', wrapAsync(getProjectByIdController));

projectRouter.post('/', projectValidation, wrapAsync(createProjectController));

projectRouter.patch('/:id', projectValidation, wrapAsync(updateProjectController));

projectRouter.delete('/:id', wrapAsync(deleteProjectController));

export default projectRouter;
