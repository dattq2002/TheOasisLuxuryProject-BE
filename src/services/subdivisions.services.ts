import { ObjectId } from 'mongodb';
import databaseService from './database.services';
import { createSubdivisionReq, updateSubdivisionReq } from '~/models/requests/subdivision.request';
import Subdivision from '~/models/schemas/Subdivision.schemas';

class SubdivisionServices {
  async getSubdivisions() {
    const result = await databaseService.subdivisions.find({}).toArray();
    return result;
  }
  async getSubdivisionById(id: string) {
    const result = await databaseService.subdivisions.findOne({ _id: new ObjectId(id) });
    return result;
  }
  async createSubdivision(payload: createSubdivisionReq) {
    const _id = new ObjectId();

    const newSubdivision = await databaseService.subdivisions.insertOne(
      new Subdivision({
        _id,
        ...payload,
        villas: payload.villas || [],
        quantityVilla: payload.quantityVilla || 0
      })
    );
    return newSubdivision;
  }
  async updateSubdivision(id: string, payload: updateSubdivisionReq) {
    const result = await databaseService.subdivisions.updateOne(
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
  async deleteSubdivisionById(id: string) {
    const result = await databaseService.subdivisions.deleteOne({ _id: new ObjectId(id) });
    return result;
  }
}

const subdivisionServices = new SubdivisionServices();
export default subdivisionServices;
