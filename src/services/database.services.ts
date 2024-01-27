import { config } from 'dotenv';
import { MongoClient, Db, Collection } from 'mongodb';
import Project from '~/models/schemas/Project.schemas';
config();
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@bipu1304.kbgoy1k.mongodb.net/?retryWrites=true&w=majority`;

class DatabaseService {
  private client: MongoClient;
  private db: Db;
  constructor() {
    this.client = new MongoClient(uri);
    this.db = this.client.db(process.env.DB_NAME);
  }
  async connect() {
    try {
      //   await this.client.db(process.env.DB_NAME).command({ ping: 1 })
      await this.db.command({ ping: 1 });
      console.log('Pinged your deployment. You successfully connected to MongoDB with Project TheOasisLuxury!');
    } catch (err) {
      console.log('lỗi trong quá trình kết nối', err);
      throw err;
    }
  }

  get projects(): Collection<Project> {
    return this.db.collection(process.env.DB_COLLECTION_PROJECT as string);
  }

}
const databaseService = new DatabaseService();
export default databaseService;
