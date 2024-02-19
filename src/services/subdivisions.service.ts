import { ObjectId } from 'mongodb';
import databaseService from './database.service';
import { createSubdivisionReq, updateSubdivisionReq } from '~/models/requests/subdivision.request';
import Subdivision from '~/models/schemas/Subdivision.schemas';

class SubdivisionServices {
  async getSubdivisions() {
    const result = await databaseService.subdivisions.find({}).toArray();
    return result;
  }
  async getSubdivisionById(id: string) {
    const result = await databaseService.subdivisions.findOne({ _id: new ObjectId(id) });
    const villas = await databaseService.villas.find({ subdivision_id: new ObjectId(id) }).toArray();
    if (result) result.villas = villas;
    return result;
  }
  async createSubdivision(payload: createSubdivisionReq) {
    const _id = new ObjectId();

    const newSubdivision = await databaseService.subdivisions.insertOne(
      new Subdivision({
        _id,
        ...payload,
        quantityVilla: payload.quantityVilla || 0
      })
    );
    const subdivision = await databaseService.subdivisions.findOne({ _id: newSubdivision.insertedId });

    await databaseService.projects.findOneAndUpdate(
      {
        _id: new ObjectId(payload.project_id)
      },

      {
        $push: {
          subdivisions: new Subdivision({
            _id: new ObjectId(subdivision?._id),
            ...payload,
            quantityVilla: payload.quantityVilla || 0
          })
        }
      }
    );
    return subdivision;
  }
  async updateSubdivision(id: string, payload: updateSubdivisionReq) {
    await databaseService.subdivisions.updateOne(
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
    const subdivision = await databaseService.subdivisions.findOne({ _id: new ObjectId(id) });
    return subdivision;
  }
  async deleteSubdivisionById(id: string) {
    const result = await databaseService.subdivisions.deleteOne({ _id: new ObjectId(id) });
    //tìm và xóa villa trong subdivision
    const project = await databaseService.projects.findOne({
      subdivisions: {
        $elemMatch: {
          _id: new ObjectId(id)
        }
      }
    });
    if (!project) return result;
    await databaseService.projects.findOneAndUpdate(
      {
        _id: new ObjectId(project._id)
      },
      {
        $pull: {
          subdivisions: {
            _id: new ObjectId(id)
          }
        }
      }
    );
    return result;
  }
}

const subdivisionServices = new SubdivisionServices();
export default subdivisionServices;
