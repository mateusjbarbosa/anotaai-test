export class UUID {
  static validate(uuid: string): string {
    const uuidRegex = RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );

    if (!uuidRegex.test(uuid)) throw new Error('Invalid UUID');

    return uuid;
  }
}
