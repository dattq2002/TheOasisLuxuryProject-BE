import { ObjectId } from 'mongodb';
import { Time_ShareType } from '~/constants/enum';

interface TimeShareType {
  _id?: ObjectId;
  time_share_name: string;
  start_date: Date;
  end_date: Date;
  deflag?: boolean;
}

export default class TimeShare {
  _id?: ObjectId;
  time_share_name: string;
  start_date: Date;
  end_date: Date;
  deflag: boolean;
  constructor(timeShare: TimeShareType) {
    this._id = timeShare._id;
    this.time_share_name = timeShare.time_share_name;
    this.start_date = timeShare.start_date;
    this.end_date = timeShare.end_date;
    this.deflag = timeShare.deflag || false;
  }
}
