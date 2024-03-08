import { ObjectId } from 'mongodb';

interface VillaTimeShareType {
  _id?: ObjectId;
  villa_id: ObjectId;
  insert_date?: Date;
  update_date?: Date;
  start_date: Date;
  end_date: Date;
  user_id?: ObjectId;
  period_time?: number;
}

export default class VillaTimeShare {
  _id?: ObjectId;
  villa_id: ObjectId;
  insert_date: Date;
  user_id?: ObjectId;
  start_date: Date;
  end_date: Date;
  period_time?: number;
  update_date: Date;
  constructor(villaType: VillaTimeShareType) {
    this._id = villaType._id;
    this.villa_id = villaType.villa_id;
    this.insert_date = villaType.insert_date || new Date();
    this.user_id = villaType.user_id;
    this.period_time = villaType.period_time;
    this.update_date = villaType.update_date || new Date();
    this.start_date = villaType.start_date;
    this.end_date = villaType.end_date;
  }
}
