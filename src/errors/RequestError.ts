export class RequestError extends Error {
  constructor() {
    super('anotaai-test Request error');
    this.name = 'Request Error';
  }
}
