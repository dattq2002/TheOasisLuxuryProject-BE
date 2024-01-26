import { ObjectId } from 'mongodb';
import { SubdivisionStatus } from '~/constants/enum';

export interface createSubdivisionReq {
  subdivision_name: string;
  location: string;
  quantityVilla?: number;
  villas?: ObjectId[];
  status: SubdivisionStatus;
}

export interface updateSubdivisionReq {
  subdivision_name?: string;
  location?: string;
  quantityVilla?: number;
  villas?: ObjectId[];
  status?: SubdivisionStatus;
}
