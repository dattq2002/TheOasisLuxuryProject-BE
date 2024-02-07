import { ObjectId } from 'mongodb';

interface VillaTimeShareType {
  _id?: ObjectId;
  villa_id: ObjectId;
  insert_date: Date;
  time_share_id: ObjectId;
  user_id?: ObjectId;
  period_time?: number;
}

export default class VillaTimeShare {
  _id?: ObjectId;
  villa_id: ObjectId;
  insert_date: Date;
  user_id?: ObjectId;
  time_share_id: ObjectId;
  period_time?: number;
  constructor(villaType: VillaTimeShareType) {
    this._id = villaType._id;
    this.villa_id = villaType.villa_id;
    this.insert_date = villaType.insert_date;
    this.user_id = villaType.user_id;
    this.time_share_id = villaType.time_share_id;
    this.period_time = villaType.period_time;
  }
}
