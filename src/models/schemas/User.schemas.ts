import { ObjectId } from 'mongodb';
import { AccountStatus, RoleName } from '~/constants/enum';

interface UserType {
  _id?: ObjectId;
  full_name: string;
  birthday: Date;
  phone_number: string;
  user_name: string;
  email: string;
  password: string;
  gender?: string;
  email_verify_token?: string;
  forgot_password_token?: string;
  email_verify?: boolean;
  insert_date?: Date;
  update_date?: Date;
  url_image?: string;
  status?: string;
  role_name?: string;
}

export default class User {
  _id?: ObjectId;
  full_name: string;
  birthday: Date;
  phone_number: string;
  user_name: string;
  email: string;
  password: string;
  gender: string;
  email_verify_token: string;
  forgot_password_token: string;
  email_verify: boolean;
  insert_date: Date;
  update_date: Date;
  url_image: string;
  status: string;
  role_name: string;
  constructor(user: UserType) {
    this.full_name = user.full_name;
    this.birthday = user.birthday;
    this.phone_number = user.phone_number;
    this.gender = user.gender || '';
    this.email_verify_token = user.email_verify_token || '';
    this.forgot_password_token = user.forgot_password_token || '';
    this.email_verify = user.email_verify || false;
    this.insert_date = user.insert_date || new Date();
    this.update_date = user.update_date || new Date();
    this.url_image = user.url_image || '';
    this.email = user.email;
    this.password = user.password;
    this.status = user.status || AccountStatus.ACTIVE;
    this.user_name = user.user_name;
    this.role_name = user.role_name || RoleName.USER;
  }
}
