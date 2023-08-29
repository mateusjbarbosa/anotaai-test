import { sum } from './example';

describe('Example', () => {
  it('should be true', () => {
    expect(2 + 2).toBe(4);
  });

  it('should call example function correctly', () => {
    const result = sum(2, 2);

    expect(result).toBe(4);
  });
});
