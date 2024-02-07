import { ObjectId } from 'mongodb';
import databaseService from './database.service';
import { ErrorWithStatus } from '~/models/Error';
import HTTP_STATUS from '~/constants/httpStatus';
import { TimeShareReqBody, UpdateTimeShareReqBody } from '~/models/requests/time_share.request';
import TimeShare from '~/models/schemas/TimeShare.schemas';

class TimeShareService {
  async getTimeShares() {
    const timeShares = databaseService.timeshares.find({}).toArray();
    return timeShares;
  }

  async getTimeShareById(id: string) {
    const timeShare = databaseService.timeshares.findOne({
      _id: new ObjectId(id)
    });
    if (!timeShare) {
      throw new ErrorWithStatus({
        message: 'Time share not found',
        status: HTTP_STATUS.NOT_FOUND
      });
    }
    return timeShare;
  }

  async createTimeShare(timeShare: TimeShareReqBody) {
    const _id = new ObjectId();
    const result = await databaseService.timeshares.insertOne(
      new TimeShare({
        _id,
        ...timeShare
      })
    );
    if (!result.insertedId) {
      throw new ErrorWithStatus({
        message: 'Create time share failed',
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      });
    }
    const newTimeShare = await databaseService.timeshares.findOne({
      _id: result.insertedId
    });
    return newTimeShare;
  }

  async updateTimeShare(id: string, timeShare: UpdateTimeShareReqBody) {
    const result = await databaseService.timeshares.updateOne({ _id: new ObjectId(id) }, [
      {
        $set: timeShare
      }
    ]);
    if (!result.matchedCount) {
      throw new ErrorWithStatus({
        message: 'Time share not found',
        status: HTTP_STATUS.NOT_FOUND
      });
    }
    const updatedTimeShare = await databaseService.timeshares.findOne({
      _id: new ObjectId(id)
    });
    return updatedTimeShare;
  }

  async deleteTimeShare(id: string) {
    const result = await databaseService.timeshares.deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) {
      throw new ErrorWithStatus({
        message: 'Time share not found',
        status: HTTP_STATUS.NOT_FOUND
      });
    }
    return result.acknowledged;
  }
}

const timeShareService = new TimeShareService();
export default timeShareService;
