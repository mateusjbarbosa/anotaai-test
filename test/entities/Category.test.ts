import { Category } from '../../src/entities/Category';

const ownerID = 'd49b0660-1989-4a6c-b7ae-26d2d43764a4';

describe('Category', () => {
  it('should create a category correctly', () => {
    const category = new Category('valid_name', 'valid_description', ownerID);

    expect(category).toBeDefined();
  });

  it('show throw error when category title is not sent', () => {
    expect(() => new Category('','valid_description', ownerID)).toThrow(
      new Error('The category title is required'),
    );
  });

  it('should throw error when category title has more than 50 characters', () => {
    // eslint-disable-next-line max-len
    const invalidTitle = 'Nostrud cupidatat qui aliquip duis voluptate non Lorem dolor minim duis dolor et magna quis';

    expect(() => new Category(invalidTitle, 'valid_description', ownerID)).toThrow(
      new Error('The category title must have a maximum of 50 characters'),
    );
  });

  it('show throw error when category description is not sent', () => {
    expect(() => new Category('valid_title', '', ownerID)).toThrow(
      new Error('The category description is required'),
    );
  });

  it('should throw error when category description has more than 250 characters', () => {
    // eslint-disable-next-line max-len
    const invalidDescription = 'Adipisicing exercitation id ut eiusmod excepteur id. Consectetur aliquip laboris officia laborum laboris officia commodo. Adipisicing pariatur enim magna ipsum cupidatat id labore pariatur enim laboris mollit ut labore. Laborum aliquip qui dolore voluptate. Deserunt proident esse nostrud ad cupidatat deserunt excepteur sunt qui excepteur.';

    expect(() => new Category('valid_title', invalidDescription, ownerID)).toThrow(
      new Error('The category description must have a maximum of 250 characters'),
    );
  });

  it('show throw error when category ownerID is not sent', () => {
    expect(() => new Category('valid_title', 'valid_description', '')).toThrow(
      new Error('The owner UUID is required'),
    );
  });

  it('should throw error when category ownerID is invalid', () => {
    expect(() => new Category('valid_title', 'valid_description', 'invalid_owner_id')).toThrow(
      new Error('The owner UUID is invalid'),
    );
  });

  it('should be able to handle category ID correctly', () => {
    const categoryWithoutInitialID = new Category('valid_name', 'valid_description', ownerID);
    expect(categoryWithoutInitialID.ID).toBeUndefined();

    categoryWithoutInitialID.ID = '8adb605b-4fa2-4d76-85b4-c39ce8b50db5';
    expect(categoryWithoutInitialID.ID).toBeDefined();

    const categoryWithInitialID = new Category(
      'valid_name',
      'valid_description',
      ownerID,
      '793970e5-94f4-496c-8b91-6f6f234bf0ff'
    );
    expect(categoryWithInitialID.ID).toBeDefined();

    expect(() => new Category('valid_title', 'valid_description', ownerID, 'invalid_category_id'))
      .toThrow(new Error('The category UUID is invalid'));

    expect(() => {
      const category = new Category('valid_name', 'valid_description', ownerID);
      category.ID = 'invalid_category_id';
    }).toThrow(
      new Error('The category UUID is invalid'),
    );
  });
});
