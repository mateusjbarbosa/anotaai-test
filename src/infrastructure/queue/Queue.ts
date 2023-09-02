export interface Queue {
  sendMessage(queue: string, message: string, action: string): Promise<void>;
  receiveMessage(): Promise<void>;
}
