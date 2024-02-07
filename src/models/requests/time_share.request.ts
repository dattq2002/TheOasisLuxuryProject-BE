export interface TimeShareReqBody {
  time_share_name: string;
  time_share_type: string;
}

export interface UpdateTimeShareReqBody {
  time_share_name?: string;
  time_share_type?: string;
}
