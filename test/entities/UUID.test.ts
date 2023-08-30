import { UUID } from '../../src/entities/UUID';

describe('UUID', () => {
  it('should validate UUID correctly', () => {
    const uuid = UUID.validate('dd38fc73-6177-4be0-a7c9-7aafc6341133');

    expect(uuid).toBeDefined();
  });

  it.each([
    'invalid_uuid',
    '1234-5678',
    '6d8c2854-e7d2-474f-bf98'
  ])('should throw error when uuid is invalid', (uuid) => {
    expect(() => UUID.validate(uuid)).toThrow(new Error('Invalid UUID'));
  },
  );

  it('should create new UUID correctly', () => {
    const uuid = UUID.create();

    expect(UUID.validate(uuid)).toBe(uuid);
  });
});
