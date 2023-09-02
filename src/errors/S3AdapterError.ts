export class S3AdapterError extends Error {
  constructor() {
    super('anotaai-test S3 Adapter error');
    this.name = 'S3Adapter Error';
  }
}
