import { ObjectId } from 'mongodb';
import databaseService from '../databases/database.service';
import Utilities from '~/models/schemas/Utilities.schemas';
import { ErrorWithStatus } from '~/models/Error';
import HTTP_STATUS from '~/constants/httpStatus';

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
    if (!result) {
      throw new ErrorWithStatus({ message: 'Utilities not found', status: HTTP_STATUS.NOT_FOUND });
    }
    return result;
  }
  async deleteUtility(id: string) {
    const utilities = await this.getUtilityById(id);
    const result = await databaseService.utilities.deleteOne({ _id: utilities._id });
    return result;
  }
}
const utilitiesService = new UtilitiesService();
export default utilitiesService;
