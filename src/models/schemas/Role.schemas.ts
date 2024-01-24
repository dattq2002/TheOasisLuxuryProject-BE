import { ObjectId } from 'mongodb';

interface RoleType {
  _id?: ObjectId;
  role_name: string;
  insert_date?: Date;
  deflag: boolean;
}

export default class Role {
  _id?: ObjectId;
  role_name: string;
  insert_date: Date;
  deflag: boolean;
  constructor(role: RoleType) {
    this.role_name = role.role_name;
    this.insert_date = role.insert_date || new Date();
    this.deflag = role.deflag || false;
  }
}
