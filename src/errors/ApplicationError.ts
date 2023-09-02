export class ApplicationError extends Error {
  constructor() {
    super('anotaai-test Aplication bootstrapping error');
    this.name = 'Application Error';
  }
}
