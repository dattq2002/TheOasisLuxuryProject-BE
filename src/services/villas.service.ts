import { ObjectId } from 'mongodb';
import databaseService from '../databases/database.service';
import {
  createVillaDetailReq,
  createVillaReq,
  createVillaTimeShareReq,
  updateVillaReq
} from '~/models/requests/villa.request';
import Villa from '~/models/schemas/Villa.schemas';
import VillaTimeShare from '~/models/schemas/VillaTimeShare.schemas';
import VillaDetail from '~/models/schemas/VillaDetail.schemas';
import { ErrorWithStatus } from '~/models/Error';
import HTTP_STATUS from '~/constants/httpStatus';
import { VILLAS_MESSAGES } from '~/constants/message';

class VillaServices {
  async getVillas() {
    const result = await databaseService.villas.find({}).toArray();
    return result;
  }
  async getVillaById(id: string) {
    const result = await databaseService.villas.findOne({ _id: new ObjectId(id) });
    if (!result) {
      throw new ErrorWithStatus({
        message: VILLAS_MESSAGES.VILLA_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      });
    }
    return result;
  }
  async createVilla(payload: createVillaReq) {
    const _id = new ObjectId();

    const result = await databaseService.villas.insertOne(
      new Villa({
        _id,
        ...payload,
        url_image: payload.url_image || [],
        subdivision_id: new ObjectId(payload.subdivision_id),
        villa_detail_id: new ObjectId(payload.villa_detail_id)
      })
    );
    const countVilla = await databaseService.villas.countDocuments({
      subdivision_id: new ObjectId(payload.subdivision_id)
    });
    await databaseService.subdivisions.findOneAndUpdate(
      {
        _id: new ObjectId(payload.subdivision_id)
      },

      {
        $push: {
          villas: new Villa({
            _id,
            ...payload,
            url_image: payload.url_image || [],
            subdivision_id: new ObjectId(payload.subdivision_id),
            villa_detail_id: new ObjectId(payload.villa_detail_id)
          })
        },
        $inc: {
          quantityVilla: countVilla + 1
        }
      }
    );
    const newVilla = await this.getVillaById(result.insertedId.toString());
    return newVilla;
  }
  async updateVilla(id: string, payload: updateVillaReq) {
    const villa = await this.getVillaById(id);
    const result = await databaseService.villas.updateOne(
      {
        _id: villa._id
      },
      [
        {
          $set: {
            ...payload,
            update_date: '$$NOW'
          }
        }
      ]
    );
    return result;
  }
  async deleteVillaById(id: string) {
    const villa = await this.getVillaById(id);
    const result = await databaseService.villas.deleteOne({ _id: villa._id });
    //tìm và xóa villa trong subdivision
    const subdivision = await databaseService.subdivisions.findOne({
      villas: {
        $elemMatch: {
          _id: villa._id
        }
      }
    });
    if (!subdivision) return result;
    const countVilla = await databaseService.villas.countDocuments({
      subdivision_id: new ObjectId(subdivision._id)
    });
    await databaseService.subdivisions.findOneAndUpdate(
      {
        _id: new ObjectId(subdivision._id)
      },
      {
        $pull: {
          villas: {
            _id: villa._id
          }
        },
        $inc: {
          quantityVilla: countVilla - 1
        }
      }
    );
    return result;
  }

  async createVillaTimeShare(payload: createVillaTimeShareReq) {
    const result = await databaseService.villaTimeShares.insertOne(
      new VillaTimeShare({
        ...payload,
        villa_id: new ObjectId(payload.villa_id),
        time_share_id: new ObjectId(payload.time_share_id)
      })
    );
    const newVillaTimeShare = await databaseService.villaTimeShares.findOne({ _id: result.insertedId });
    return newVillaTimeShare;
  }

  async getVillaBySubdivisionId(subdivisionId: string) {
    const result = await databaseService.villas
      .find({
        subdivision_id: subdivisionId as any
      })
      .toArray();
    return result;
  }
  async createVillaDetail(req: createVillaDetailReq) {
    const result = await databaseService.villaDetails.insertOne(
      new VillaDetail({
        ...req
      })
    );
    const newVillaDetail = await databaseService.villaDetails.findOne({ _id: result.insertedId });
    return newVillaDetail;
  }

  async getVillaTimeShareByVillaId(villaId: string) {
    const result = await databaseService.villaTimeShares
      .find({
        villa_id: new ObjectId(villaId)
      })
      .toArray();
    return result;
  }
}

const villasServices = new VillaServices();
export default villasServices;
