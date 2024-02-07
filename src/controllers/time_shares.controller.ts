import { Request, Response } from 'express';
import timeShareService from '~/services/time_shares.service';
import { ParamsDictionary } from 'express-serve-static-core';
import { TimeShareReqBody, UpdateTimeShareReqBody } from '~/models/requests/time_share.request';

export const getTimeShareController = async (req: Request, res: Response) => {
  const result = await timeShareService.getTimeShares();
  return res.json({
    message: 'Get time shares success',
    result
  });
};

export const getTimeShareByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await timeShareService.getTimeShareById(id);
  return res.json({
    message: 'Get time share by id success',
    result
  });
};

export const createTimeShareController = async (
  req: Request<ParamsDictionary, any, TimeShareReqBody>,
  res: Response
) => {
  const result = await timeShareService.createTimeShare(req.body);
  return res.json({
    message: 'Create time share success',
    result
  });
};

export const updateTimeShareController = async (
  req: Request<ParamsDictionary, any, UpdateTimeShareReqBody>,
  res: Response
) => {
  const { id } = req.params;
  const result = await timeShareService.updateTimeShare(id, req.body);
  return res.json({
    message: 'Update time share success',
    result
  });
};

export const deleteTimeShareController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await timeShareService.deleteTimeShare(id);
  return res.json({
    message: 'Delete time share success',
    result
  });
};
