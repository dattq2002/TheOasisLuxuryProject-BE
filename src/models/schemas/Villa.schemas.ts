import { ObjectId } from 'mongodb';
import { VillaStatus } from '~/constants/enum';
import VillaDetail from './VillaDetail.schemas';

interface VillaType {
  _id?: ObjectId;
  villa_name: string;
  status: VillaStatus;
  insert_date?: Date;
  update_date?: Date;
  address: string;
  area: string;
  url_image?: string[];
  fluctuates_price: number;
  stiff_price: number;
  villa_detail_id?: ObjectId;
  subdivision_id: ObjectId;
  time_share_id?: ObjectId;
  villa_details?: VillaDetail[];
}

export default class Villa {
  _id?: ObjectId;
  villa_name: string;
  status: VillaStatus;
  insert_date: Date;
  update_date: Date;
  address: string;
  area: string;
  url_image: string[];
  fluctuates_price: number;
  stiff_price: number;
  time_share_id?: ObjectId;
  villa_detail_id?: ObjectId;
  subdivision_id: ObjectId;
  villa_details: VillaDetail[];
  constructor(data: VillaType) {
    this._id = data._id;
    this.villa_name = data.villa_name;
    this.status = data.status;
    this.insert_date = data.insert_date || new Date();
    this.update_date = data.update_date || new Date();
    this.address = data.address;
    this.area = data.area;
    this.url_image = data.url_image || [];
    this.fluctuates_price = data.fluctuates_price;
    this.stiff_price = data.stiff_price;
    this.villa_detail_id = data.villa_detail_id;
    this.subdivision_id = data.subdivision_id;
    this.villa_details = data.villa_details || [];
    this.time_share_id = data.time_share_id;
  }
}
