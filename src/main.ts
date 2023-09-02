import express from 'express';
import { pino } from 'pino';
import { ApplicationError } from './errors/ApplicationError';
import { router } from './infrastructure/http/routes';
import { watchCatalogUpdates } from './receive-messages';

const main = () => {
  try {
    const app = express();

    app.use(express.json());
    app.use(router);

    watchCatalogUpdates();

    app.listen(process.env.PORT, () => {
      pino().info(`anotaai-test running at ${process.env.PORT}`);
    });
  } catch (error: unknown) {
    if (error instanceof ApplicationError) pino().error(error.message);
  }
};

main();
