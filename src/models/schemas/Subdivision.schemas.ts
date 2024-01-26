import { ObjectId } from 'mongodb';
import { SubdivisionStatus } from '~/constants/enum';

interface SubdivisionType {
  _id?: ObjectId;
  subdivision_name: string;
  location: string;
  insert_date?: Date;
  update_date?: Date;
  quantityVilla: number;
  status: SubdivisionStatus;
  villas: ObjectId[];
}

export default class Subdivision {
  _id?: ObjectId;
  subdivision_name: string;
  location: string;
  insert_date: Date;
  update_date: Date;
  quantityVilla: number;
  status: SubdivisionStatus;
  villas: ObjectId[];
  constructor(subdivision: SubdivisionType) {
    this.subdivision_name = subdivision.subdivision_name;
    this.location = subdivision.location;
    this.insert_date = subdivision.insert_date || new Date();
    this.update_date = subdivision.update_date || new Date();
    this.quantityVilla = subdivision.quantityVilla;
    this.villas = subdivision.villas || [];
    this.status = subdivision.status;
  }
}
