import { config } from 'dotenv';
import { Db, MongoClient } from 'mongodb';
import { UUID } from '../../entities/UUID';

export class MongoClientAdapter {
  private connection: MongoClient | undefined;
  database: Db | undefined;

  constructor() {
    try {
      config();

      // eslint-disable-next-line no-console
      console.log({
        uri: process.env.MONGO_URI,
        db: process.env.MONGO_DB
      });

      this.connection = new MongoClient(process.env.MONGO_URI || '', {
        pkFactory: {
          createPk: () => UUID.create()
        }
      });
      this.database = this.connection.db(process.env.MONGO_DB || '');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any) {
      // eslint-disable-next-line no-console
      console.log('anotaai-test database error!');
      // eslint-disable-next-line no-console
      console.log(error.message);
    }
  }
}
