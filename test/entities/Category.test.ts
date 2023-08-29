import { Category } from '../../src/entities/Category';

const ownerID = 'd49b0660-1989-4a6c-b7ae-26d2d43764a4';

describe('Category', () => {
  it('should create a category correctly', () => {
    const category = new Category('valid_name', 'valid_description', ownerID);

    expect(category).toBeDefined();
  });

  it('should throw error when category title has more than 50 characters', () => {
    // eslint-disable-next-line max-len
    const invalidTitle = 'Nostrud cupidatat qui aliquip duis voluptate non Lorem dolor minim duis dolor et magna quis';

    expect(() => new Category(invalidTitle, 'valid_description', ownerID)).toThrow(
      new Error('The category title must have a maximum of 50 characters'),
    );
  });

  it('should throw error when category description has more than 250 characters', () => {
    // eslint-disable-next-line max-len
    const invalidDescription = 'Adipisicing exercitation id ut eiusmod excepteur id. Consectetur aliquip laboris officia laborum laboris officia commodo. Adipisicing pariatur enim magna ipsum cupidatat id labore pariatur enim laboris mollit ut labore. Laborum aliquip qui dolore voluptate. Deserunt proident esse nostrud ad cupidatat deserunt excepteur sunt qui excepteur.';

    expect(() => new Category('valid_title', invalidDescription, ownerID)).toThrow(
      new Error('The category description must have a maximum of 250 characters'),
    );
  });

  it('should throw error when category ownerID is invalid', () => {
    expect(() => new Category('valid_title', 'valid_description', 'invalid_owner_id')).toThrow(
      new Error('Invalid UUID'),
    );
  });
});
