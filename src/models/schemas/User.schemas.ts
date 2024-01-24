import { ObjectId } from 'mongodb';
import Account from './Account.schemas';

interface UserType {
  _id?: ObjectId;
  full_name: string;
  birthday?: Date;
  phone_number: string;
  gender?: string;
  email_verify_token?: string;
  forgot_password_token?: string;
  email_verify?: boolean;
  insert_date?: Date;
  update_date?: Date;
  account_id: string;
  url_image?: string;
  Account: Account;
}

export default class User {
  _id?: ObjectId;
  full_name: string;
  birthday: Date;
  phone_number: string;
  gender: string;
  email_verify_token: string;
  forgot_password_token: string;
  email_verify: boolean;
  insert_date: Date;
  update_date: Date;
  account_id: string;
  url_image: string;
  Account: Account;
  constructor(user: UserType) {
    this.full_name = user.full_name;
    this.birthday = user.birthday || new Date();
    this.phone_number = user.phone_number;
    this.gender = user.gender || '';
    this.email_verify_token = user.email_verify_token || '';
    this.forgot_password_token = user.forgot_password_token || '';
    this.email_verify = user.email_verify || false;
    this.insert_date = user.insert_date || new Date();
    this.update_date = user.update_date || new Date();
    this.account_id = user.account_id;
    this.url_image = user.url_image || '';
    this.Account = user.Account;
  }
}
