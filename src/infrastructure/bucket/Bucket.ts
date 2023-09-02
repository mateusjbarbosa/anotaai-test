export interface Bucket {
  createObject(bucketName: string, objectName: string, data: string): Promise<void>;
  listObjects(bucketName: string): Promise<string[]>;
  getObject(bucketName: string, objectKey: string): Promise<string>;
}
