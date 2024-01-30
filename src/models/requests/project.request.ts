import { ObjectId } from 'mongodb';
import { ProjectStatus } from '~/constants/enum';
import Subdivision from '../schemas/Subdivision.schemas';

export interface createProjectReq {
  project_name: string;
  start_date: Date;
  end_date: Date;
  status: ProjectStatus;
  description: string;
  subdivisions?: Subdivision[];
}

export interface updateProjectReq {
  project_name: string;
  start_date: Date;
  end_date: Date;
  status: ProjectStatus;
  description: string;
}

export interface addSubdivisionToProjectReq {
  subdivision_id: ObjectId;
}
