import { Product } from '../../src/entities/Product';

const categoryID = '4acb7629-8eb2-42e8-b4ea-eae60aef97fe';
const ownerID = 'd49b0660-1989-4a6c-b7ae-26d2d43764a4';

describe('Product', () => {
  it('should create a product correctly', () => {
    const product = new Product('valid_name', 'valid_description', 100, categoryID, ownerID);

    expect(product).toBeDefined();
  });

  it('should throw error when product title is not sent', () => {
    expect(() => new Product('', 'valid_description', 100, categoryID, ownerID)).toThrow(
      new Error('The product title is required'),
    );
  });

  it('should throw error when product title has more than 50 characters', () => {
    // eslint-disable-next-line max-len
    const invalidTitle = 'Nostrud cupidatat qui aliquip duis voluptate non Lorem dolor minim duis dolor et magna quis';

    expect(() => new Product(invalidTitle, 'valid_description', 100, categoryID, ownerID)).toThrow(
      new Error('The product title must have a maximum of 50 characters'),
    );
  });

  it('should throw error when product description is not sent', () => {
    expect(() => new Product('valid_title', '', 100, categoryID, ownerID)).toThrow(
      new Error('The product description is required'),
    );
  });

  it('should throw error when product description has more than 250 characters', () => {
    // eslint-disable-next-line max-len
    const invalidDescription = 'Adipisicing exercitation id ut eiusmod excepteur id. Consectetur aliquip laboris officia laborum laboris officia commodo. Adipisicing pariatur enim magna ipsum cupidatat id labore pariatur enim laboris mollit ut labore. Laborum aliquip qui dolore voluptate. Deserunt proident esse nostrud ad cupidatat deserunt excepteur sunt qui excepteur.';

    expect(() => new Product('valid_title', invalidDescription, 100, categoryID, ownerID)).toThrow(
      new Error('The product description must have a maximum of 250 characters'),
    );
  });

  it('should throw error when product price is not positive', () => {
    expect(() => new Product('valid_title', 'valid_description', -1, categoryID, ownerID)).toThrow(
      new Error('The product price must be positive'),
    );
  });

  it('show throw error when product categoryID is not sent', () => {
    expect(() => new Product('valid_title', 'valid_description', 100, '', ownerID)).toThrow(
      new Error('The category UUID is required'),
    );
  });

  it('should throw error when product categoryID is invalid', () => {
    expect(
      () => new Product('valid_title', 'valid_description', 100, 'invalid_category_id', ownerID),
    ).toThrow(new Error('The category UUID is invalid'));
  });

  it('show throw error when product categoryID is not sent', () => {
    expect(() => new Product('valid_title', 'valid_description', 100, categoryID, '')).toThrow(
      new Error('The owner UUID is required'),
    );
  });

  it('should throw error when product ownerID is invalid', () => {
    expect(
      () => new Product('valid_title', 'valid_description', 100, categoryID, 'invalid_owner_id'),
    ).toThrow(new Error('The owner UUID is invalid'));
  });

  it('should be able to handle product ID correctly', () => {
    const productWithoutInitialID =
      new Product('valid_name', 'valid_description', 100, categoryID, ownerID);
    expect(productWithoutInitialID.ID).toBeUndefined();

    productWithoutInitialID.ID = '8adb605b-4fa2-4d76-85b4-c39ce8b50db5';
    expect(productWithoutInitialID.ID).toBeDefined();

    const productWithInitialID = new Product(
      'valid_name',
      'valid_description',
      100,
      categoryID,
      ownerID,
      '1f2db461-d711-4d2f-bce9-94f37a1f81cc'
    );
    expect(productWithInitialID.ID).toBeDefined();

    expect(() => new Product(
      'valid_title', 'valid_description', 100, categoryID, ownerID, 'invalid_product_id'
    )).toThrow(new Error('The product UUID is invalid'));

    expect(() => {
      const product = new Product('valid_name', 'valid_description', 100, categoryID, ownerID);
      product.ID = 'invalid_product_id';
    }).toThrow(
      new Error('The product UUID is invalid'),
    );
  });
});
