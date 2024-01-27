import { ObjectId } from 'mongodb';
import { VillaStatus } from '~/constants/enum';

interface VillaType {
  _id?: ObjectId;
  villa_name: string;
  status: VillaStatus;
  insert_date?: Date;
  update_date?: Date;
  address: string;
  area: number;
  url_image?: string[];
  fluctuates_price: number;
  stiff_price: number;
  villas_detail?: string[];
}

export default class Villa {
  _id?: ObjectId;
  villa_name: string;
  status: VillaStatus;
  insert_date: Date;
  update_date: Date;
  address: string;
  area: number;
  url_image: string[];
  fluctuates_price: number;
  stiff_price: number;
  villas_detail: string[];
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
    this.villas_detail = data.villas_detail || [];
  }
}
