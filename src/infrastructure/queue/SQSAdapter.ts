import AWS from 'aws-sdk';
import { config } from 'dotenv';
import pino from 'pino';
import { SQSAdapterError } from '../../errors/SQSAdapterError';
import { Queue } from './Queue';

export class SQSAdapter implements Queue {
  private service: AWS.SQS;

  constructor() {
    config();

    this.service = new AWS.SQS({
      apiVersion: 'latest',
      region: process.env.AWS_REGION || '',
      credentials: new AWS.Credentials({
        accessKeyId: process.env.AWS_ACESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACESS_KEY || ''
      })
    });
  }

  async sendMessage(queue: string, message: string, action: string): Promise<void> {
    try {
      await this.service.sendMessage({
        // eslint-disable-next-line max-len
        QueueUrl: `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/${queue}`,
        MessageBody: JSON.stringify({
          action,
          message
        }),
      }).promise();
    } catch (error: unknown) {
      if (error instanceof SQSAdapterError) pino().error(error.message);

      throw new Error('Error during send the message');
    }
  }

  async receiveMessage(queue: string, messageTreatment: (message: string) => void): Promise<void> {
    try {
      const result = await this.service.receiveMessage({
        // eslint-disable-next-line max-len
        QueueUrl: `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/${queue}`,
        WaitTimeSeconds: 15,
        MaxNumberOfMessages: 1,
      }).promise();

      if (result.Messages) {
        for(const message of result.Messages) {
          pino().info(`Message received: ${message.MessageId}`);

          messageTreatment(message.Body!);

          await this.service.deleteMessage({
            // eslint-disable-next-line max-len
            QueueUrl: `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/${queue}`,
            ReceiptHandle: message.ReceiptHandle!
          }).promise();
        }
      }
    } catch (error: unknown) {
      if (error instanceof SQSAdapterError) pino().error(error.message);

      throw new Error('Error during receive messages');
    }
  }
}
