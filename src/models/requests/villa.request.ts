import { VillaStatus } from '~/constants/enum';

export interface createVillaReq {
  villa_name: string;
  status: VillaStatus;
  address: string;
  area: number;
  url_image?: string[];
  fluctuates_price: number;
  stiff_price: number;
  villas_detail?: string[];
}

export interface updateVillaReq {
  villa_name: string;
  status: VillaStatus;
  address: string;
  area: number;
  url_image?: string[];
  fluctuates_price: number;
  stiff_price: number;
  villas_detail?: string[];
}
