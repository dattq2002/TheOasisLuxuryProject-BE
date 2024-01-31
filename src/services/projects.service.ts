import { ObjectId } from 'mongodb';
import databaseService from './database.service';
import { createProjectReq, updateProjectReq } from '~/models/requests/project.request';
import Project from '~/models/schemas/Project.schemas';

class ProjectsService {
  async getProjects() {
    const result = await databaseService.projects.find({}).toArray();
    return result;
  }
  async getProjectById(id: string) {
    const result = await databaseService.projects.findOne({ _id: new ObjectId(id) });
    return result;
  }
  async createProject(payload: createProjectReq) {
    const _id = new ObjectId();
    const newPrject = await databaseService.projects.insertOne(
      new Project({
        _id,
        ...payload,
        subdivisions: []
      })
    );
    const project = await databaseService.projects.findOne({ _id: newPrject.insertedId });
    return project;
  }
  async updateProjectById(id: string, payload: updateProjectReq) {
    const result = await databaseService.projects.updateOne(
      {
        _id: new ObjectId(id)
      },
      [
        {
          $set: {
            ...payload,
            update_date: '$$NOW'
          }
        }
      ]
    );
    const project = await databaseService.projects.findOne({ _id: new ObjectId(id) });
    return project;
  }
  async deleteProjectById(id: string) {
    const result = await databaseService.projects.deleteOne({ _id: new ObjectId(id) });
    return result;
  }
  async addSubdivisionToProject(id: string, subdivision_id: ObjectId) {
    const result = await databaseService.projects.updateOne(
      {
        _id: new ObjectId(id)
      },
      [
        {
          $push: {
            subdivisions: new ObjectId(subdivision_id)
          },
          $set: {
            update_date: '$$NOW'
          }
        }
      ]
    );
    return result;
  }
}

const projectsService = new ProjectsService();
export default projectsService;
