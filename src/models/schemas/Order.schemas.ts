import { ObjectId } from 'mongodb';

interface OrderType {
  _id?: ObjectId;
  order_name: string;
  price: number;
  user_id: ObjectId;
  status: string;
  villa_time_share_id: ObjectId;
  insert_date?: Date;
  update_date?: Date;
  invoice_id?: string;
  description?: string;
  start_date: Date;
  end_date?: Date;
}

export default class Order {
  _id?: ObjectId;
  order_name: string;
  insert_date: Date;
  update_date: Date;
  user_id: ObjectId;
  price: number;
  invoice_id: string;
  description: string;
  start_date: Date;
  end_date?: Date;
  status: string;
  villa_time_share_id: ObjectId;
  constructor(order: OrderType) {
    this._id = order._id;
    this.order_name = order.order_name;
    this.insert_date = order.insert_date || new Date();
    this.update_date = order.update_date || new Date();
    this.user_id = order.user_id;
    this.price = order.price;
    this.invoice_id = order.invoice_id || new Date().getTime().toString();
    this.description = order.description || '';
    this.start_date = order.start_date;
    this.end_date = order.end_date;
    this.status = order.status;
    this.villa_time_share_id = order.villa_time_share_id;
  }
}
