import express from 'express';
import { router } from './infrastructure/http/routes';

const main = () => {
  try {
    const app = express();

    app.use(express.json());
    app.use(router);

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
