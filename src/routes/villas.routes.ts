import { Router } from 'express';
import {
  createVillaController,
  deleteVillaController,
  getVillaByIdController,
  getVillasController,
  updateVillaController
} from '~/controllers/villas.controller';
import { wrapAsync } from '~/utils/handlers';

const villaRouter = Router();

villaRouter.get('/get-villas', getVillasController);

villaRouter.get('/get-villa/:id', getVillaByIdController);

villaRouter.post('/create-villa', wrapAsync(createVillaController));

villaRouter.patch('/update-villa/:id', wrapAsync(updateVillaController));

villaRouter.delete('/delete-villa/:id', wrapAsync(deleteVillaController));
export default villaRouter;
