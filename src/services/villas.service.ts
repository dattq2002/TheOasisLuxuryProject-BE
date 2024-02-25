import { ObjectId } from 'mongodb';
import databaseService from './database.service';
import {
  createVillaDetailReq,
  createVillaReq,
  createVillaTimeShareReq,
  updateVillaReq
} from '~/models/requests/villa.request';
import Villa from '~/models/schemas/Villa.schemas';
import VillaTimeShare from '~/models/schemas/VillaTimeShare.schemas';
import { Request } from 'express';
import VillaDetail from '~/models/schemas/VillaDetail.schemas';

class VillaServices {
  async getVillas() {
    const result = await databaseService.villas.find({}).toArray();
    return result;
  }
  async getVillaById(id: string) {
    const result = await databaseService.villas.findOne({ _id: new ObjectId(id) });
    return result;
  }
  async createVilla(payload: createVillaReq) {
    const _id = new ObjectId();

    const result = await databaseService.villas.insertOne(
      new Villa({
        _id,
        ...payload,
        url_image: payload.url_image || []
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
            url_image: payload.url_image || []
          })
        },
        $inc: {
          quantityVilla: countVilla + 1
        }
      }
    );
    const newVilla = await databaseService.villas.findOne({ _id: result.insertedId });
    return newVilla;
  }
  async updateVilla(id: string, payload: updateVillaReq) {
    const result = await databaseService.villas.updateOne(
      {
        _id: new ObjectId(id)
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
    const result = await databaseService.villas.deleteOne({ _id: new ObjectId(id) });
    //tìm và xóa villa trong subdivision
    const subdivision = await databaseService.subdivisions.findOne({
      villas: {
        $elemMatch: {
          _id: new ObjectId(id)
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
            _id: new ObjectId(id)
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
    return result;
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
        ...req,
        utilities_id: new ObjectId(req.utilities_id)
      })
    );
    const newVillaDetail = await databaseService.villaDetails.findOne({ _id: result.insertedId });
    return newVillaDetail;
  }
}

const villasServices = new VillaServices();
export default villasServices;
