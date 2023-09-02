export class SQSAdapterError extends Error {
  constructor() {
    super('anotaai-test SQS Adapter error');
    this.name = 'SQS Adapter Error';
  }
}
