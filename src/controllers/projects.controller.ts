import { Request, Response } from 'express';
import { PROJECTS_MESSAGES } from '~/constants/message';
import { ParamsDictionary } from 'express-serve-static-core';
import projectsService from '~/services/projects.services';
import { addSubdivisionToProjectReq, createProjectReq, updateProjectReq } from '~/models/requests/project.request';

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
  return res.json({
    message: PROJECTS_MESSAGES.GET_PROJECT_SUCCESS,
    result
  });
};

export const createProjectController = async (req: Request<ParamsDictionary, any, createProjectReq>, res: Response) => {
  const payload = req.body;
  const result = await projectsService.createProject(payload);
  return res.json({
    message: PROJECTS_MESSAGES.CREATE_PROJECT_SUCCESS,
    result
  });
};

export const updateProjectController = async (req: Request<ParamsDictionary, any, updateProjectReq>, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await projectsService.updateProjectById(id, payload);
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
