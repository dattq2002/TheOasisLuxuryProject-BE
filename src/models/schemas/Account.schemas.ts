import { ObjectId } from 'mongodb';
import { AccountStatus } from '~/constants/enum';
import Role from './Role.schemas';

interface AccountType {
  _id?: ObjectId;
  user_name: string;
  email: string;
  password: string;
  insert_date?: Date;
  update_date?: Date;
  role_id: string;
  status?: string;
  Role?: Role;
}

export default class Account {
  _id?: ObjectId;
  email: string;
  password: string;
  insert_date: Date;
  update_date: Date;
  role_id: string;
  status: string;
  Role?: Role;
  user_name: string;
  constructor(account: AccountType) {
    this.email = account.email;
    this.password = account.password;
    this.insert_date = account.insert_date || new Date();
    this.update_date = account.update_date || new Date();
    this.role_id = account.role_id;
    this.status = account.status || AccountStatus.ACTIVE;
    this.Role = account.Role || undefined;
    this.user_name = account.user_name;
  }
}
