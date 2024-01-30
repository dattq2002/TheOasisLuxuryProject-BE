import { ObjectId } from 'mongodb';
import { SubdivisionStatus } from '~/constants/enum';
import Villa from './Villa.schemas';

export interface SubdivisionType {
  _id?: ObjectId;
  subdivision_name: string;
  location: string;
  insert_date?: Date;
  update_date?: Date;
  quantityVilla: number;
  status: SubdivisionStatus;
  project_id: ObjectId;
  villas?: Villa[];
}

export default class Subdivision {
  _id?: ObjectId;
  subdivision_name: string;
  location: string;
  insert_date: Date;
  update_date: Date;
  quantityVilla: number;
  status: SubdivisionStatus;
  project_id: ObjectId;
  villas: Villa[];
  constructor(subdivision: SubdivisionType) {
    this._id = subdivision._id;
    this.subdivision_name = subdivision.subdivision_name;
    this.location = subdivision.location;
    this.insert_date = subdivision.insert_date || new Date();
    this.update_date = subdivision.update_date || new Date();
    this.quantityVilla = subdivision.quantityVilla;
    this.status = subdivision.status;
    this.project_id = subdivision.project_id;
    this.villas = subdivision.villas || [];
  }
}
