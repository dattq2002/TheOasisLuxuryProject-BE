import { Request, Response } from 'express';
import { PROJECTS_MESSAGES } from '~/constants/message';
import { ParamsDictionary } from 'express-serve-static-core';
import projectsService from '~/services/projects.service';
import { addSubdivisionToProjectReq, createProjectReq, updateProjectReq } from '~/models/requests/project.request';
import HTTP_STATUS from '~/constants/httpStatus';

export const getProjectController = async (req: Request, res: Response) => {
  const result = await projectsService.getProjects();
  return res.json({
    message: PROJECTS_MESSAGES.GET_PROJECT_SUCCESS,
    result
  });
};
export const getProjectByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await projectsService.getProjectById(id);
  if (!result)
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: PROJECTS_MESSAGES.PROJECT_NOT_FOUND,
      result
    });
  return res.json({
    message: PROJECTS_MESSAGES.GET_PROJECT_SUCCESS,
    result
  });
};

export const createProjectController = async (req: Request<ParamsDictionary, any, createProjectReq>, res: Response) => {
  const payload = req.body;
  const result = await projectsService.createProject(payload);
  return res.status(HTTP_STATUS.CREATED).json({
    message: PROJECTS_MESSAGES.CREATE_PROJECT_SUCCESS,
    result
  });
};

export const updateProjectController = async (req: Request<ParamsDictionary, any, updateProjectReq>, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await projectsService.updateProjectById(id, payload);
  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: PROJECTS_MESSAGES.UPDATE_PROJECT_FAIL,
      result
    });
  }
  return res.json({
    message: PROJECTS_MESSAGES.UPDATE_PROJECT_SUCCESS,
    result
  });
};

export const deleteProjectController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await projectsService.deleteProjectById(id);
  return res.json({
    message: PROJECTS_MESSAGES.DELETE_PROJECT_SUCCESS,
    result
  });
};

export const addSubdivisionToProjectController = async (
  req: Request<ParamsDictionary, any, addSubdivisionToProjectReq>,
  res: Response
) => {
  const { id } = req.params;
  const { subdivision_id } = req.body;
  const result = await projectsService.addSubdivisionToProject(id, subdivision_id);
  return res.json({
    message: PROJECTS_MESSAGES.ADD_SUBDIVISION_TO_PROJECT_SUCCESS,
    result
  });
};
