import { config } from 'dotenv';
import { Db, MongoClient } from 'mongodb';
import { pino } from 'pino';
import { UUID } from '../../entities/UUID';
import { MongoClientAdapterError } from '../../errors/MongoClientAdapterError';

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
    } catch (error: unknown) {
      if (error instanceof MongoClientAdapterError) pino().error(error.message);

      throw new Error('Error during MongoDB connection');
    }
  }
}
