import { ObjectId } from 'mongodb';

interface OwnerVillaType {
  _id?: ObjectId;
  user_id: ObjectId;
  villa_id: ObjectId;
  check_in_date: Date;
  check_out_date: Date;
  period_time: number;
  period_type: string;
  booking_weekday: number;
  insert_date?: Date;
  update_date?: Date;
  deflag?: boolean;
  order_detail_id?: ObjectId;
}

export default class OwnerVilla {
  _id?: ObjectId;
  user_id: ObjectId;
  villa_id: ObjectId;
  check_in_date: Date;
  check_out_date: Date;
  period_time: number;
  period_type: string;
  booking_weekday: number;
  insert_date: Date;
  update_date: Date;
  deflag: boolean;
  order_detail_id?: ObjectId;
  constructor(ownerVilla: OwnerVillaType) {
    this._id = ownerVilla._id;
    this.user_id = ownerVilla.user_id;
    this.villa_id = ownerVilla.villa_id;
    this.check_in_date = ownerVilla.check_in_date;
    this.check_out_date = ownerVilla.check_out_date;
    this.period_time = ownerVilla.period_time;
    this.period_type = ownerVilla.period_type;
    this.booking_weekday = ownerVilla.booking_weekday;
    this.insert_date = ownerVilla.insert_date || new Date();
    this.update_date = ownerVilla.update_date || new Date();
    this.deflag = ownerVilla.deflag || false;
    this.order_detail_id = ownerVilla.order_detail_id;
  }
}
