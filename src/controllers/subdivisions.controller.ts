import { Request, Response } from 'express';
import { SUBDIVISION_MESSAGES } from '~/constants/message';
import subdivisionServices from '~/services/subdivisions.service';
import { ParamsDictionary } from 'express-serve-static-core';
import { createSubdivisionReq, updateSubdivisionReq } from '~/models/requests/subdivision.request';

export const getSubdivisionController = async (req: Request, res: Response) => {
  const result = await subdivisionServices.getSubdivisions();
  res.json({
    message: SUBDIVISION_MESSAGES.GET_SUBDIVISION_SUCCESS,
    result
  });
};

export const getSubdivisionByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await subdivisionServices.getSubdivisionById(id);
  res.json({
    message: SUBDIVISION_MESSAGES.GET_SUBDIVISION_SUCCESS,
    result
  });
};

export const createSubdivisionController = async (
  req: Request<ParamsDictionary, any, createSubdivisionReq>,
  res: Response
) => {
  const { subdivision_name, location, quantityVilla, status, project_id, url_image } = req.body;
  const result = await subdivisionServices.createSubdivision({
    subdivision_name,
    location,
    quantityVilla,
    status,
    project_id,
    url_image
  });
  res.json({
    message: SUBDIVISION_MESSAGES.CREATE_SUBDIVISION_SUCCESS,
    result
  });
};

export const updateSubdivisionController = async (
  req: Request<ParamsDictionary, any, updateSubdivisionReq>,
  res: Response
) => {
  const { id } = req.params;
  const { subdivision_name, location, quantityVilla, status, url_image } = req.body;
  const result = await subdivisionServices.updateSubdivision(id, {
    subdivision_name,
    location,
    quantityVilla,
    status,
    url_image
  });
  res.json({
    message: SUBDIVISION_MESSAGES.UPDATE_SUBDIVISION_SUCCESS,
    result
  });
};

export const deleteSubdivisionController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await subdivisionServices.deleteSubdivisionById(id);
  res.json({
    message: SUBDIVISION_MESSAGES.DELETE_SUBDIVISION_SUCCESS,
    result
  });
};

export const getSubdivisionByProjectIdController = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const result = await subdivisionServices.getSubdivisionByProjectId(projectId);
  res.json({
    message: SUBDIVISION_MESSAGES.GET_SUBDIVISION_SUCCESS,
    result
  });
};
