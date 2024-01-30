import { NextFunction, Request, Response } from 'express';
import { VILLAS_MESSAGES } from '~/constants/message';
import villasServices from '~/services/villas.services';
import { ParamsDictionary } from 'express-serve-static-core';
import { createVillaReq, updateVillaReq } from '~/models/requests/villa.request';

export const getVillasController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await villasServices.getVillas();
  res.json({
    message: VILLAS_MESSAGES.GET_VILLAS_SUCCESS,
    result
  });
};

export const getVillaByIdController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await villasServices.getVillaById(id);
  res.json({
    message: VILLAS_MESSAGES.GET_VILLA_SUCCESS,
    result
  });
};

export const createVillaController = async (
  req: Request<ParamsDictionary, any, createVillaReq>,
  res: Response,
  next: NextFunction
) => {
  const {
    villa_name,
    status,
    address,
    area,
    url_image,
    fluctuates_price,
    stiff_price,
    subdivision_id,
    villa_detail_id
  } = req.body;
  const result = await villasServices.createVilla({
    villa_name,
    status,
    address,
    area,
    url_image,
    fluctuates_price,
    stiff_price,
    subdivision_id,
    villa_detail_id
  });
  res.json({
    message: VILLAS_MESSAGES.CREATE_VILLA_SUCCESS,
    result
  });
};

export const updateVillaController = async (
  req: Request<ParamsDictionary, any, updateVillaReq>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { villa_name, status, address, area, url_image, fluctuates_price, stiff_price } = req.body;
  const result = await villasServices.updateVilla(id, {
    villa_name,
    status,
    address,
    area,
    url_image,
    fluctuates_price,
    stiff_price
  });
  res.json({
    message: VILLAS_MESSAGES.UPDATE_VILLA_SUCCESS,
    result
  });
};

export const deleteVillaController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await villasServices.deleteVillaById(id);
  res.json({
    message: VILLAS_MESSAGES.DELETE_VILLA_SUCCESS,
    result
  });
};
