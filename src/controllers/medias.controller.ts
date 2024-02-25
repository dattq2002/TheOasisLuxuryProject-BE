import { Request, Response } from 'express';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir';
import HTTP_STATUS from '~/constants/httpStatus';
import mediasService from '~/services/medias.service';
import mine from 'mime';
import { USERS_MESSAGES } from '~/constants/message';

export const uploadImageController = async (req: Request, res: Response) => {
  const url = await mediasService.uploadImageVilla(req);
  res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  });
};
export const serveImageController = async (req: Request, res: Response) => {
  const { namefile } = req.params;
  res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, namefile), (err) => {
    if (err) {
      res.status((err as any).status).send('not found image');
    }
  });
};

export const uploadVideoController = async (req: Request, res: Response) => {
  const url = await mediasService.uploadVideo(req);
  res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  });
};

export const serveVideoStreamController = async (req: Request, res: Response) => {
  const { namefile } = req.params;
  const range = req.headers.range;

  //lấy kích thước tối đa của video
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, namefile);
  const videoSize = fs.statSync(videoPath).size;
  //nếu không có range thì yêu cầu range
  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Requires Range header');
  }
  const CHUNK_SIZE = 10 ** 6; //1MB
  const start = Number(range.replace(/\D/g, ''));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  //dung lượng
  const contentLength = end - start + 1;
  const contentType = mine.getType(videoPath) || 'video/*';
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  };
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers);
  const videoStreams = fs.createReadStream(videoPath, { start, end });
  videoStreams.pipe(res);
};
