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

projectRouter.get('/', accessTokenValidator, getProjectController);

projectRouter.get('/:id', accessTokenValidator, getProjectByIdController);

projectRouter.post('/', accessTokenValidator, projectValidation, wrapAsync(createProjectController));

projectRouter.patch('/:id', accessTokenValidator, projectValidation, wrapAsync(updateProjectController));

projectRouter.delete('/:id', accessTokenValidator, wrapAsync(deleteProjectController));

export default projectRouter;
