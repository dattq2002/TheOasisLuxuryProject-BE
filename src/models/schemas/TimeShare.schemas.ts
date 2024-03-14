import { ObjectId } from 'mongodb';
import { Time_ShareType } from '~/constants/enum';

interface TimeShareType {
  _id?: ObjectId;
  time_share_name: string;
  start_date: Date;
  end_date: Date;
  deflag?: boolean;
  time_share_child?: TimeShareChildType[];
}

interface TimeShareChildType {
  start_date: Date;
  end_date: Date;
  user_id: ObjectId;
  deflag?: boolean;
}

export class TimeShareChild {
  start_date: Date;
  end_date: Date;
  user_id: ObjectId;
  deflag: boolean;
  constructor(timeShareChild: TimeShareChild) {
    this.start_date = timeShareChild.start_date;
    this.end_date = timeShareChild.end_date;
    this.user_id = timeShareChild.user_id;
    this.deflag = timeShareChild.deflag || false;
  }
}

export default class TimeShare {
  _id?: ObjectId;
  time_share_name: string;
  start_date: Date;
  end_date: Date;
  deflag: boolean;
  time_share_child: TimeShareChildType[];
  constructor(timeShare: TimeShareType) {
    this._id = timeShare._id;
    this.time_share_name = timeShare.time_share_name;
    this.start_date = timeShare.start_date;
    this.end_date = timeShare.end_date;
    this.deflag = timeShare.deflag || false;
    this.time_share_child = timeShare.time_share_child || [];
  }
}
