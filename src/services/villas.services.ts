import { ObjectId } from 'mongodb';
import databaseService from './database.services';
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

    const newVilla = await databaseService.villas.insertOne(
      new Villa({
        _id,
        ...payload,
        url_image: payload.url_image || [],
        villas_detail: payload.villas_detail || []
      })
    );
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
    return result;
  }
}

const villasServices = new VillaServices();
export default villasServices;
