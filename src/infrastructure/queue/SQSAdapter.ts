import AWS from 'aws-sdk';
import { config } from 'dotenv';
import { Queue } from './Queue';

export class SQSAdapter implements Queue {
  private service: AWS.SQS;

  constructor() {
    config();

    this.service = new AWS.SQS({
      apiVersion: 'latest',
      region: 'us-east-1',
      credentials: new AWS.SharedIniFileCredentials({ profile: 'default' })
    });
  }

  async sendMessage(queue: string, message: string, action: string): Promise<void> {
    try {
      await this.service.sendMessage({
        QueueUrl: `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/${queue}`,
        MessageBody: JSON.stringify({
          action,
          message
        }),
      }).promise();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error.message);
      throw new Error('Error during send the message');
    }
  }

  receiveMessage(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
