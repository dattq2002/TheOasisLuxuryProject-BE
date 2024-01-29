import { ObjectId } from 'mongodb';
import { ProjectStatus } from '~/constants/enum';

interface ProjectType {
  _id?: ObjectId;
  project_name: string;
  start_date: Date;
  end_date: Date;
  insert_date?: Date;
  update_date?: Date;
  status: ProjectStatus;
  description?: string;
  deflag?: boolean;
}

export default class Project {
  _id?: ObjectId;
  project_name: string;
  start_date: Date;
  end_date: Date;
  insert_date: Date;
  update_date: Date;
  status: ProjectStatus;
  description: string;
  deflag: boolean;
  constructor(project: ProjectType) {
    this.project_name = project.project_name;
    this.start_date = project.start_date;
    this.end_date = project.end_date;
    this.insert_date = project.insert_date || new Date();
    this.update_date = project.update_date || new Date();
    this.status = project.status;
    this.description = project.description || '';
    this.deflag = project.deflag || false;
  }
}
