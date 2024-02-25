import { ObjectId } from 'mongodb';
import { AccountStatus, GenderType, RoleName, UserVerifyStatus } from '~/constants/enum';
import BlogPost from './BlogPost.schemas';
import Contract from './Contract.schemas';
import Order from './Order.schemas';

interface UserType {
  _id?: ObjectId;
  full_name: string;
  birthday: Date;
  phone_number: string;
  gender?: string;
  email_verify_token?: string;
  forgot_password_token?: string;
  verify?: UserVerifyStatus;
  insert_date?: Date;
  update_date?: Date;
  user_name: string;
  email: string;
  password: string;
  url_image?: string;
  status?: string;
  role_name?: string;
  blog_posts?: BlogPost[];
  contracts?: Contract[];
  orders?: Order[];
}

export default class User {
  _id?: ObjectId;
  full_name: string;
  birthday: Date;
  phone_number: string;
  gender: string;
  email_verify_token: string;
  forgot_password_token: string;
  verify: UserVerifyStatus;
  insert_date: Date;
  update_date: Date;
  user_name: string;
  email: string;
  password: string;
  url_image: string;
  status: string;
  role_name: string;
  blog_posts: BlogPost[];
  contracts: Contract[];
  orders: Order[];

  constructor(user: UserType) {
    this._id = user._id;
    this.full_name = user.full_name;
    this.birthday = user.birthday;
    this.phone_number = user.phone_number;
    this.gender = user.gender || GenderType.OTHER;
    this.email_verify_token = user.email_verify_token || '';
    this.forgot_password_token = user.forgot_password_token || '';
    this.verify = user.verify || UserVerifyStatus.Unverified;
    this.insert_date = user.insert_date || new Date();
    this.update_date = user.update_date || new Date();
    this.url_image = user.url_image || '';
    this.email = user.email;
    this.password = user.password;
    this.status = user.status || AccountStatus.ACTIVE;
    this.user_name = user.user_name;
    this.role_name = user.role_name || RoleName.USER;
    this.blog_posts = user.blog_posts || [];
    this.contracts = user.contracts || [];
    this.orders = user.orders || [];
  }
}
