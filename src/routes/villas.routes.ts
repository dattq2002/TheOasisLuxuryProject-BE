import { Router } from 'express';
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

villaRouter.get('/', accessTokenValidator, getVillasController);

villaRouter.get('/:id', accessTokenValidator, getVillaByIdController);

villaRouter.post('/', accessTokenValidator, wrapAsync(createVillaController));

villaRouter.patch('/:id', accessTokenValidator, wrapAsync(updateVillaController));

villaRouter.delete('/:id', accessTokenValidator, wrapAsync(deleteVillaController));

villaRouter.post('/create-villa-time-share', accessTokenValidator, wrapAsync(createVillaTimeShareController));

villaRouter.get('/subdivision/:id', accessTokenValidator, wrapAsync(getVillaBySubdivisionIdController));

villaRouter.post('/upload-image', accessTokenValidator, wrapAsync(uploadImageVillaController));

villaRouter.post('/create-villa-detail', accessTokenValidator, wrapAsync(createVillaDetailController));

villaRouter.get('/villa-time-share/:villaId', accessTokenValidator, wrapAsync(getVillaTimeShareByVillaIdController));

export default villaRouter;
