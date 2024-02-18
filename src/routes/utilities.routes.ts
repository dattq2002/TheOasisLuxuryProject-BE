import { Router } from 'express';
import {
  createUtiliesController,
  deleteUtilitesController,
  getUtiliesController,
  getUtilityByIdController
} from '~/controllers/utilities.controller';
import { accessTokenValidator } from '~/middlewares/user.middleware';
import { createUtilitiesValidation } from '~/middlewares/utilities.middleware';
import { wrapAsync } from '~/utils/handlers';

const utilitiesRouter = Router();

utilitiesRouter.post('/', accessTokenValidator, createUtilitiesValidation, wrapAsync(createUtiliesController));

utilitiesRouter.get('/', accessTokenValidator, wrapAsync(getUtiliesController));

utilitiesRouter.get('/:id', accessTokenValidator, wrapAsync(getUtilityByIdController));

utilitiesRouter.delete('/:id', accessTokenValidator, wrapAsync(deleteUtilitesController));

export default utilitiesRouter;
