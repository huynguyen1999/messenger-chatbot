export class InvalidVerifyToken extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'Invalid Verify Token';
  }
}
