import { Router } from 'express';
import {
  addSubdivisionToProjectController,
  createProjectController,
  deleteProjectController,
  getProjectByIdController,
  getProjectController,
  updateProjectController
} from '~/controllers/projects.controller';
import { wrapAsync } from '~/utils/handlers';

const projectRouter = Router();

projectRouter.get('/get-project', getProjectController);

projectRouter.get('/get-project/:id', getProjectByIdController);

projectRouter.post('/create-project', wrapAsync(createProjectController));

projectRouter.patch('/update-project/:id', wrapAsync(updateProjectController));

projectRouter.delete('/delete-project/:id', wrapAsync(deleteProjectController));

projectRouter.post('/add-subdivision/:id', wrapAsync(addSubdivisionToProjectController));
export default projectRouter;
