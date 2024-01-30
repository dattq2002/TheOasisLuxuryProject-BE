import { ObjectId } from 'mongodb';

interface OrderDetailType {
  _id?: ObjectId;
  insert_date?: Date;
  update_date?: Date;
  order_id: ObjectId;
  owner_villa_id: ObjectId;
}

export default class OrderDetail {
  _id?: ObjectId;
  insert_date: Date;
  update_date: Date;
  order_id: ObjectId;
  owner_villa_id: ObjectId;
  constructor(orderDetail: OrderDetailType) {
    this._id = orderDetail._id;
    this.insert_date = orderDetail.insert_date || new Date();
    this.update_date = orderDetail.update_date || new Date();
    this.order_id = orderDetail.order_id;
    this.owner_villa_id = orderDetail.owner_villa_id;
  }
}
