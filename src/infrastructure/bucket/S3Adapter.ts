import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import AWS from 'aws-sdk';
import { config } from 'dotenv';
import { Bucket } from './Bucket';

export class S3Adapter implements Bucket {
  private s3: AWS.S3;
  private s3Client: S3Client;

  constructor() {
    config();

    const s3Params = {
      apiVersion: 'latest',
      region: process.env.AWS_REGION || '',
      credentials: new AWS.SharedIniFileCredentials({ profile: 'default' })
    };

    this.s3 = new AWS.S3(s3Params);
    this.s3Client = new S3Client(s3Params);
  }

  async createObject(bucketName: string, objectName: string, data: string): Promise<void> {
    await this.s3.upload({
      Bucket: bucketName,
      Key: objectName,
      Body: data
    }).promise();
  }

  async listObjects(bucketName: string): Promise<string[]> {
    const result = await this.s3.listObjects({
      Bucket: bucketName
    }).promise();

    const objects: string[] = [];
    if (result.Contents) {
      result.Contents.forEach((object) => objects.push(object.Key || ''));
    }

    return objects;
  }

  async getObject(bucketName: string, objectKey: string): Promise<string> {
    try {
      const fileRequestCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey
      });

      const request = await this.s3Client.send(fileRequestCommand);

      const response = await request.Body?.transformToString();

      return response || '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error.message);
      throw new Error(`Error during get object of bucket ${bucketName} with key ${objectKey}`);
    }
  }
}
