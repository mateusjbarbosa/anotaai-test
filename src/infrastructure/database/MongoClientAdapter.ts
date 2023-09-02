import { config } from 'dotenv';
import { Db, MongoClient } from 'mongodb';
import { UUID } from '../../entities/UUID';

export class MongoClientAdapter {
  private connection: MongoClient | undefined;
  database: Db | undefined;

  constructor() {
    try {
      config();

      this.connection = new MongoClient(process.env.MONGO_URI || '', {
        pkFactory: {
          createPk: () => UUID.create()
        }
      });
      this.database = this.connection.db('anotaai-test-db');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any) {
      // eslint-disable-next-line no-console
      console.log('anotaai-test database error!');
      // eslint-disable-next-line no-console
      console.log(error.message);
    }
  }

  async close(): Promise<void>{
    this.connection?.close();
  }
}
