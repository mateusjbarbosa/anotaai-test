export class MongoClientAdapterError extends Error {
  constructor() {
    super('anotaai-test MongoClientAdapter error');
    this.name = 'MongoClientAdapter Error';
  }
}
