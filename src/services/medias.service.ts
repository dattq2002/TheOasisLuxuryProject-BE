import { Request } from 'express';
import sharp from 'sharp';
import { UPLOAD_IMAGE_DIR } from '~/constants/dir';
import { getNameFromFullname, handleUploadImage, handleUploadVideo } from '~/utils/files';
import fs from 'fs';
import { isProduction } from '~/constants/config';
import { Media } from '~/models/Other';
import { MediaType } from '~/constants/enum';
import databaseService from './database.service';
import { ObjectId } from 'mongodb';

class MediaService {
  async uploadImageVilla(req: Request) {
    //check and lưu ảnh vào trong uploads/temp
    const files = await handleUploadImage(req);
    //xử lý file bằng sharp giúp tối ưu hóa ảnh
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newFilename = getNameFromFullname(file.newFilename) + '.jpg';
        const newPath = UPLOAD_IMAGE_DIR + '/' + newFilename;
        const info = await sharp(file.filepath).jpeg().toFile(newPath);
        //xóa file ảnh trong uploads/temp
        fs.unlinkSync(file.filepath);

        return {
          url: isProduction
            ? `${process.env.HOST}/static/image/${newFilename}`
            : `http://localhost:${process.env.PORT}/api/v1/static/image/${newFilename}`,
          type: MediaType.Image
        };
      })
    );
    //sau khi có ảnh thì cập nhật ảnh vào trong db collection villa
    const villaId = req.query.villa_id;
    const villa = await databaseService.villas.findOne({ _id: new ObjectId(villaId as string) });
    if (!villa) throw new Error('Villa not found');
    const newUrlImage = [...villa.url_image, ...result.map((item) => item.url)];
    await databaseService.villas.updateOne(
      { _id: new ObjectId(villaId as string) },
      {
        $set: {
          url_image: newUrlImage
        }
      }
    );

    return result;
  }
  async uploadVideo(req: Request) {
    //lưu video vào trong uploads/video
    const files = await handleUploadVideo(req);
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const { newFilename } = file;
        return {
          url: isProduction
            ? `${process.env.HOST}/static/video-stream/${newFilename}`
            : `http://localhost:${process.env.PORT}/api/v1/static/video-stream/${newFilename}`,
          type: MediaType.Video
        };
      })
    );
    return result;
  }
}

const mediaService = new MediaService();
export default mediaService;
