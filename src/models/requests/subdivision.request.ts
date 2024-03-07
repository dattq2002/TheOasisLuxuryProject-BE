import { ObjectId } from 'mongodb';
import { SubdivisionStatus } from '~/constants/enum';

export interface createSubdivisionReq {
  subdivision_name: string;
  location: string;
  quantityVilla?: number;
  status: SubdivisionStatus;
  project_id: string;
}

export interface updateSubdivisionReq {
  subdivision_name: string;
  location: string;
  quantityVilla?: number;
  status: SubdivisionStatus;
}
