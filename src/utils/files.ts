import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir';
import fs from 'fs';
import formidable, { File } from 'formidable';
import path from 'path';
import { Request } from 'express';

export const initFolder = () => {
  [UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true //cho phép tạo folder lồng nhau(nested folder)
      });
    }
  });
};

export const getNameFromFullname = (filename: string) => {
  const nameArr = filename.split('.');
  nameArr.pop();
  return nameArr.join('');
};

export const getExtension = (filename: string) => {
  const nameArr = filename.split('.');
  return nameArr[nameArr.length - 1];
};

//hàm xử lý file mà client đã gửi lên
export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve(UPLOAD_IMAGE_TEMP_DIR),
    keepExtensions: true,
    maxFiles: 4,
    maxFileSize: 300 * 1024,
    maxTotalFileSize: 300 * 1024 * 4,
    // maxFileSize: 5 * 1024 * 1024,
    // maxTotalFileSize: 4 * 5 * 1024 * 1024,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'));
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any);
      }
      return valid;
    }
  });

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      if (!files.image) {
        return reject(new Error('File is empty'));
      }
      return resolve(files.image as File[]);
    });
  });
};

//hàm xử lý file mà client đã gửi lên
export const handleUploadVideo = async (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve(UPLOAD_VIDEO_DIR),
    // keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 50 * 1024 * 1024, //50MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('video/'));
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any);
      }
      return valid;
    }
  });

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      if (!files.video) {
        return reject(new Error('File is empty'));
      }
      //trong file{originalFilename, filepath, newFilename}
      //vì mình đã tắt keepExtensions nên file không có 'đuôi của file'
      const videos = files.video as File[]; //lấy ra danh sách các video đã upload
      videos.forEach((video) => {
        const ext = getExtension(video.originalFilename as string); //lấy đuôi của tên gốc
        video.newFilename += `.${ext}`; //lắp đuôi vào tên mới
        fs.renameSync(video.filepath, `${video.filepath}.${ext}`); //lắp đuôi vào filepath: đường dẫn đến file mới
      });
      return resolve(files.video as File[]);
    });
  });
};
