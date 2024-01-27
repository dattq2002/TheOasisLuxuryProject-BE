import { ObjectId } from 'mongodb';
import { ProjectStatus } from '~/constants/enum';

export interface createProjectReq {
  project_name: string;
  start_date: Date;
  end_date: Date;
  status: ProjectStatus;
  description: string;
  subdivisions?: ObjectId[];
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
