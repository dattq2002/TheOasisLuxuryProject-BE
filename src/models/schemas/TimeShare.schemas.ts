import { ObjectId } from 'mongodb';

interface TimeShareType {
  _id?: ObjectId;
  time_share_name: string;
  insert_date?: Date;
  update_date?: Date;
  deflag?: boolean;
  time_share_type: string;
}

export default class TimeShare {
  _id?: ObjectId;
  time_share_name: string;
  insert_date: Date;
  update_date: Date;
  deflag: boolean;
  time_share_type: string;
  constructor(timeShare: TimeShareType) {
    this._id = timeShare._id;
    this.time_share_name = timeShare.time_share_name;
    this.insert_date = timeShare.insert_date || new Date();
    this.update_date = timeShare.update_date || new Date();
    this.deflag = timeShare.deflag || false;
    this.time_share_type = timeShare.time_share_type;
  }
}
