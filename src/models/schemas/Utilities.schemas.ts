import { ObjectId } from 'mongodb';

interface UtilitiesType {
  _id?: ObjectId;
  utilities_name: string;
  insert_date?: Date;
  update_date?: Date;
  deflag?: boolean;
}

export default class Utilities {
  _id?: ObjectId;
  utilities_name: string;
  insert_date: Date;
  update_date: Date;
  deflag: boolean;
  constructor(utilities: UtilitiesType) {
    this._id = utilities._id;
    this.utilities_name = utilities.utilities_name;
    this.insert_date = utilities.insert_date || new Date();
    this.update_date = utilities.update_date || new Date();
    this.deflag = utilities.deflag || false;
  }
}
