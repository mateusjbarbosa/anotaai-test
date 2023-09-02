import express from 'express';
import { router } from './infrastructure/http/routes';
import { watchCatalogUpdates } from './receive-messages';

const main = () => {
  try {
    const app = express();

    app.use(express.json());
    app.use(router);

    watchCatalogUpdates();

    app.listen(process.env.PORT, () => {
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
