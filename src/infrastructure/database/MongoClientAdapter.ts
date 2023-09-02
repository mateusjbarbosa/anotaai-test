import { config } from 'dotenv';
import { Db, MongoClient } from 'mongodb';
import { pino } from 'pino';
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
      this.database = this.connection.db(process.env.MONGO_DB || '');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any) {
      pino().error('anotaai-test MongoDB error');
      pino().error(error.message);

      throw new Error('Error during MongoDB connection');
    }
  }
}
