import express from 'express';
import { pino } from 'pino';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    pino().error('anotaai-test error :(');
    pino().error(error.message);
  }
};

main();
