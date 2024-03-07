import { Router } from 'express';
import { getUserOwnVillaController } from '~/controllers/users.controller';
import {
  createVillaController,
  createVillaDetailController,
  createVillaTimeShareController,
  deleteVillaController,
  getVillaByIdController,
  getVillaBySubdivisionIdController,
  getVillaTimeShareByVillaIdController,
  getVillasController,
  updateVillaController,
  uploadImageVillaController
} from '~/controllers/villas.controller';
import { accessTokenValidator } from '~/middlewares/user.middleware';
import { wrapAsync } from '~/utils/handlers';

const villaRouter = Router();

villaRouter.get('/', getVillasController);

villaRouter.get('/:id', wrapAsync(getVillaByIdController));

villaRouter.post('/', wrapAsync(createVillaController));

villaRouter.patch('/:id', wrapAsync(updateVillaController));

villaRouter.delete('/:id', wrapAsync(deleteVillaController));

villaRouter.post('/create-villa-time-share', wrapAsync(createVillaTimeShareController));

villaRouter.get('/subdivision/:id', wrapAsync(getVillaBySubdivisionIdController));

villaRouter.post('/upload-image', wrapAsync(uploadImageVillaController));

villaRouter.post('/create-villa-detail', wrapAsync(createVillaDetailController));

villaRouter.get('/villa-time-share/:villaId', wrapAsync(getVillaTimeShareByVillaIdController));

villaRouter.get('/user/:userID', accessTokenValidator, wrapAsync(getUserOwnVillaController));

export default villaRouter;
