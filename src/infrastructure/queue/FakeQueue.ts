import { Queue } from './Queue';

export class FakeQueue implements Queue {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sendMessage(queue: string, message: string, action: string): Promise<void> {
    return new Promise(resolve => {
      resolve();
    });
  }
  receiveMessage(): Promise<void> {
    throw new Error('Method not implemented.');
  }

}
