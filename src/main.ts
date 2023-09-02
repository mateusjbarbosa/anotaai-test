import express from 'express';
import cron from 'node-cron';
import { UpdateCatalog, UpdateCatalogAction } from './application/usecases/owner/UpdateCatalog';
import { Product } from './entities/Product';
import { S3Adapter } from './infrastructure/bucket/S3Adapter';
import { MongoClientAdapter } from './infrastructure/database/MongoClientAdapter';
import { router } from './infrastructure/http/routes';
import { SQSAdapter } from './infrastructure/queue/SQSAdapter';
import {
  CategoryRepositoryMongoDatabase
} from './infrastructure/repositories/mongodb/CategoryMongoDatabase';
import {
  ProductRepositoryMongoDatabase
} from './infrastructure/repositories/mongodb/ProductMongoDatabase';

const main = () => {
  try {
    const app = express();

    app.use(express.json());
    app.use(router);

    const queue = new SQSAdapter();
    cron.schedule('*/5 * * * * *', async () => {
      await queue.receiveMessage('catalog-emit', async (message: string) => {
        const parsedMessage: { action: string , message: string } = JSON.parse(message);
        const product = JSON.parse(parsedMessage.message);
        const bucket = new S3Adapter();
        const connection = new MongoClientAdapter().database;
        const categoryRepository = new CategoryRepositoryMongoDatabase(connection!);
        const productRepository = new ProductRepositoryMongoDatabase(connection!);

        const usecase = new UpdateCatalog(bucket, categoryRepository, productRepository);

        await usecase.execute({
          action: parsedMessage.action as UpdateCatalogAction,
          product: new Product(
            product.title,
            product.description,
            product.price,
            String(product.categoryID),
            String(product.ownerID),
            String(product._ID)
          )
        });
      });
    });

    app.listen(3000, () => {
      // eslint-disable-next-line no-console
      console.log('anotaai-test running at 3000');
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('anotaai-test error :(');
    // eslint-disable-next-line no-console
    console.log(error.message);
  }
};

main();
