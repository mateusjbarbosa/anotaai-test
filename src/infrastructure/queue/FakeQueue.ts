import { Queue } from './Queue';

export class FakeQueue implements Queue {
  sendMessage(): Promise<void> {
    return new Promise(resolve => {
      resolve();
    });
  }
  receiveMessage(): Promise<void> {
    throw new Error('Method not implemented.');
  }

}
