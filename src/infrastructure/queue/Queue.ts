export interface Queue {
  sendMessage(queue: string, message: string, action: string): Promise<void>;
  receiveMessage(queue: string, messageTreatment: (message: string) => void): Promise<void>;
}
