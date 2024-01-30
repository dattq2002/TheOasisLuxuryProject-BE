import { ObjectId } from 'mongodb';

interface OrderType {
  _id?: ObjectId;
  order_name: string;
  insert_date?: Date;
  update_date?: Date;
  deflag?: boolean;
  user_id: ObjectId;
  price: number;
  invoice_id: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  status: string;
  contract_id: ObjectId;
  payment_id: ObjectId;
}

export default class Order {
  _id?: ObjectId;
  order_name: string;
  insert_date: Date;
  update_date: Date;
  deflag: boolean;
  user_id: ObjectId;
  price: number;
  invoice_id: string;
  description: string;
  start_date: Date;
  end_date: Date;
  status: string;
  contract_id: ObjectId;
  payment_id: ObjectId;
  constructor(order: OrderType) {
    this._id = order._id;
    this.order_name = order.order_name;
    this.insert_date = order.insert_date || new Date();
    this.update_date = order.update_date || new Date();
    this.deflag = order.deflag || false;
    this.user_id = order.user_id;
    this.price = order.price;
    this.invoice_id = order.invoice_id;
    this.description = order.description || '';
    this.start_date = order.start_date;
    this.end_date = order.end_date;
    this.status = order.status;
    this.contract_id = order.contract_id;
    this.payment_id = order.payment_id;
  }
}
