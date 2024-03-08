import { ObjectId } from 'mongodb';
import { VillaStatus } from '~/constants/enum';

export interface createVillaReq {
  villa_name: string;
  status: VillaStatus;
  address: string;
  area: string;
  fluctuates_price: number;
  stiff_price: number;
  villa_detail_id?: ObjectId;
  start_date?: Date;
  end_date?: Date;
  subdivision_id: string;
}

export interface updateVillaReq {
  villa_name: string;
  status: VillaStatus;
  address: string;
  area: string;
  url_image?: string[];
  fluctuates_price: number;
  stiff_price: number;
}

export interface createVillaDetailReq {
  room_quantity: number;
  bath_room: number;
  bed_room: number;
  description?: string;
}

export interface createVillaTimeShareReq {
  villa_id: string;
  period_time?: number;
  start_date: Date;
  end_date: Date;
}

export interface UploadImageQueryReq {
  villa_id: string;
}
