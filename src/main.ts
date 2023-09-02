import express from 'express';
import cron from 'node-cron';
import { router } from './infrastructure/http/routes';
import { SQSAdapter } from './infrastructure/queue/SQSAdapter';

const main = () => {
  try {
    const app = express();

    app.use(express.json());
    app.use(router);

    const queue = new SQSAdapter();
    cron.schedule('*/5 * * * * *', async () => {
      await queue.receiveMessage('catalog-emit', (message: string) => {
        const parsedMessage: {action: string, message: string} = JSON.parse(message);
        const product = JSON.parse(parsedMessage.message);

        // eslint-disable-next-line no-console
        console.log(product);
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
