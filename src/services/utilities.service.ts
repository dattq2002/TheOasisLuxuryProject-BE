import { ObjectId } from 'mongodb';
import databaseService from './database.service';
import Utilities from '~/models/schemas/Utilities.schemas';

class UtilitiesService {
  async createUtilities(utilities_name: string) {
    const _id = new ObjectId();
    const result = await databaseService.utilities.insertOne(
      new Utilities({
        _id,
        utilities_name
      })
    );
    const newUtilities = await databaseService.utilities.findOne({ _id: result.insertedId });
    return newUtilities;
  }
  async getUtilities() {
    const result = await databaseService.utilities.find({}).toArray();
    return result;
  }
  async getUtilityById(id: string) {
    const result = await databaseService.utilities.findOne({ _id: new ObjectId(id) });
    return result;
  }
  async deleteUtility(id: string) {
    const result = await databaseService.utilities.deleteOne({ _id: new ObjectId(id) });
    return result;
  }
}
const utilitiesService = new UtilitiesService();
export default utilitiesService;
