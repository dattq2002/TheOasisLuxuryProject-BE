import { Time_ShareType } from '~/constants/enum';

export interface TimeShareReqBody {
  time_share_name: string;
  time_share_type: Time_ShareType;
  start_date: Date;
  end_date: Date;
}

export interface UpdateTimeShareReqBody {
  time_share_name?: string;
  time_share_type?: string;
}
