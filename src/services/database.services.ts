import { config } from 'dotenv';
import { MongoClient, Db, Collection } from 'mongodb';
import RefreshToken from '~/models/requests/RefreshToken.schema';
import Account from '~/models/schemas/Account.schemas';
import Role from '~/models/schemas/Role.schemas';
import User from '~/models/schemas/User.schemas';
config();
const uri = `mongodb+srv://dattrang2002:dat2002@theoasisluxury.vuzyle1.mongodb.net/?retryWrites=true&w=majority`;

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
      console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } catch (err) {
      console.log('lỗi trong quá trình kết nối', err);
      throw err;
    }
  }
  get accounts(): Collection<Account> {
    return this.db.collection('accounts');
  }
  get roles(): Collection<Role> {
    return this.db.collection('roles');
  }
  get users(): Collection<User> {
    return this.db.collection('users');
  }
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection('refresh_tokens');
  }
}
const databaseService = new DatabaseService();
export default databaseService;
