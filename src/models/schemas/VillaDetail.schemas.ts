import { ObjectId } from 'mongodb';

interface VillaDetailType {
  _id?: ObjectId;
  utilities_id: ObjectId;
  insert_date?: Date;
  update_date?: Date;
  room_quantity?: number;
  bath_room?: number;
  bed_room?: number;
  description?: string;
}

export default class VillaDetail {
  _id?: ObjectId;
  utilities_id: ObjectId;
  insert_date: Date;
  update_date: Date;
  room_quantity: number;
  bath_room: number;
  bed_room: number;
  description: string;
  constructor(villaDetail: VillaDetailType) {
    this._id = villaDetail._id;
    this.insert_date = villaDetail.insert_date || new Date();
    this.update_date = villaDetail.update_date || new Date();
    this.room_quantity = villaDetail.room_quantity || 0;
    this.bath_room = villaDetail.bath_room || 0;
    this.bed_room = villaDetail.bed_room || 0;
    this.description = villaDetail.description || '';
    this.utilities_id = villaDetail.utilities_id;
  }
}
