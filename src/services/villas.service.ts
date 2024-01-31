import { ObjectId } from 'mongodb';
import databaseService from './database.service';
import { createVillaReq, updateVillaReq } from '~/models/requests/villa.request';
import Villa from '~/models/schemas/Villa.schemas';

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
}

const villasServices = new VillaServices();
export default villasServices;
