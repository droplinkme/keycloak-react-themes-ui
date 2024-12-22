export class MessageException extends Error {
  description?: string;

  constructor(message: string, description?: string) {
    super(message);
    this.description = description;
  }
}