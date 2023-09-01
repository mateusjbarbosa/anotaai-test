import crypto from 'node:crypto';

export class UUID {
  static validate(uuid: string, calledBy: string): string {
    if (!uuid) throw new Error(`The ${calledBy} UUID is required`);

    const uuidRegex = RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );

    if (!uuidRegex.test(uuid)) throw new Error(`The ${calledBy} UUID is invalid`);

    return uuid;
  }

  static create(): string {
    return crypto.randomUUID();
  }
}
