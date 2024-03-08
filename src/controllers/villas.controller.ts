import { NextFunction, Request, Response } from 'express';
import { VILLAS_MESSAGES } from '~/constants/message';
import villasServices from '~/services/villas.service';
import { ParamsDictionary } from 'express-serve-static-core';
import {
  UploadImageQueryReq,
  createVillaDetailReq,
  createVillaReq,
  createVillaTimeShareReq,
  updateVillaReq
} from '~/models/requests/villa.request';
import mediaService from '~/services/medias.service';

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
  const result = await villasServices.createVilla(req.body);
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

export const createVillaTimeShareController = async (
  req: Request<ParamsDictionary, any, createVillaTimeShareReq>,
  res: Response,
  next: NextFunction
) => {
  const result = await villasServices.createVillaTimeShare(req.body);
  res.json({
    message: VILLAS_MESSAGES.CREATE_VILLA_TIME_SHARE_SUCCESS,
    result
  });
};

export const getVillaBySubdivisionIdController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await villasServices.getVillaBySubdivisionId(id);
  res.json({
    message: VILLAS_MESSAGES.GET_VILLA_BY_SUBDIVISION_ID_SUCCESS,
    result
  });
};

export const uploadImageVillaController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediaService.uploadImageVilla(req);
  res.json({
    message: VILLAS_MESSAGES.UPLOAD_IMAGE_VILLA_SUCCESS,
    result
  });
};

export const createVillaDetailController = async (
  req: Request<ParamsDictionary, any, createVillaDetailReq>,
  res: Response,
  next: NextFunction
) => {
  const { room_quantity, bath_room, bed_room, description } = req.body;
  const result = await villasServices.createVillaDetail({
    room_quantity,
    bath_room,
    bed_room,
    description
  });
  res.json({
    message: VILLAS_MESSAGES.CREATE_VILLA_DETAIL_SUCCESS,
    result
  });
};

export const getVillaTimeShareByVillaIdController = async (req: Request, res: Response, next: NextFunction) => {
  const { villaId } = req.params;
  const result = await villasServices.getVillaTimeShareByVillaId(villaId);
  res.json({
    message: VILLAS_MESSAGES.GET_VILLA_TIME_SHARE_BY_VILLA_ID_SUCCESS,
    result
  });
};
