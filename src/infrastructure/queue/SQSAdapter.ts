import AWS from 'aws-sdk';
import { config } from 'dotenv';

export class SQSAdapter {
  private service: AWS.SQS;

  constructor() {
    config();

    this.service = new AWS.SQS({
      apiVersion: 'latest'
    });
  }

  async sendMessage(queue: string, message: string): Promise<void> {
    try {
      await this.service.sendMessage({
        QueueUrl: `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/${queue}`,
        MessageBody: message
      }).promise();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error('Error during send the message');
    }
  }
}
