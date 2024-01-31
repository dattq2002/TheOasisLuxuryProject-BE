import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import HTTP_STATUS from '~/constants/httpStatus';
import { UTILITIES_MESSAGES } from '~/constants/message';
import { CreateUtilityReq } from '~/models/requests/utility.request';
import utilitiesService from '~/services/utilities.service';

export const createUtiliesController = async (req: Request<ParamsDictionary, any, CreateUtilityReq>, res: Response) => {
  const { utilities_name } = req.body;
  const result = await utilitiesService.createUtilities(utilities_name);
  if (!result)
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: UTILITIES_MESSAGES.CREATE_UTILITIES_FAIL
    });
  res.json({
    message: UTILITIES_MESSAGES.CREATE_UTILITIES_SUCCESS,
    result
  });
};

export const getUtiliesController = async (req: Request, res: Response) => {
  const result = await utilitiesService.getUtilities();

  res.json({
    message: UTILITIES_MESSAGES.GET_UTILITIES_SUCCESS,
    result
  });
};

export const getUtilityByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await utilitiesService.getUtilityById(id);
  if (!result)
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: UTILITIES_MESSAGES.GET_UTILITY_FAIL
    });
  res.json({
    message: UTILITIES_MESSAGES.GET_UTILITY_SUCCESS,
    result
  });
};

export const deleteUtilitesController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await utilitiesService.deleteUtility(id);
  if (!result)
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: UTILITIES_MESSAGES.DELETE_UTILITIES_FAIL
    });
  res.json({
    message: UTILITIES_MESSAGES.DELETE_UTILITIES_SUCCESS
  });
};
