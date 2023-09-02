import { RegisterCategory } from '../../../../src/application/usecases/category/RegisterCategory';
import { DeleteProduct } from '../../../../src/application/usecases/product/DeleteProduct';
import {
  RegisterProduct,
  RegisterProductOutput
} from '../../../../src/application/usecases/product/RegisterProduct';
import {
  CategoryRepositoryInMemoryDatabase
} from '../../../../src/infrastructure/repositories/in-memory/CategoryRepositoryInMemory';
import {
  ProductRepositoryInMemoryDatabase
} from '../../../../src/infrastructure/repositories/in-memory/ProductRepositoryInMemory';

const ownerID = 'd49b0660-1989-4a6c-b7ae-26d2d43764a4';

const categoryRepository = new CategoryRepositoryInMemoryDatabase();
const productRepository = new ProductRepositoryInMemoryDatabase();
let createdProduct: RegisterProductOutput;

describe('DeleteProduct usecase', () => {
  beforeEach(async () => {
    const registerCategoryUsecase = new RegisterCategory(categoryRepository);
    const createdCategory = await registerCategoryUsecase.execute({
      title: 'valid_title',
      description: 'valid_description',
      ownerID,
    });

    const registerProductUsecase = new RegisterProduct(productRepository);
    createdProduct = await registerProductUsecase.execute({
      title: 'valid_title',
      description: 'valid_description',
      price: 100,
      categoryID: createdCategory.id,
      ownerID,
    });
  });

  it('should delete a product correctly', async () => {
    const usecase = new DeleteProduct(productRepository);

    await usecase.execute({ ID: createdProduct.id });

    expect(productRepository.data.length).toBe(0);
  });

  it('should throw error when product not found', async () => {
    const usecase = new DeleteProduct(productRepository);

    await expect(usecase.execute({ ID: 'fce2a477-11b2-4f8f-8f06-b34bd98074fa' }))
      .rejects.toThrow(new Error('Product not found'));

    expect(productRepository.data.length).toBe(1);
  });

  it('should throw error when product ID is invalid', async () => {
    const usecase = new DeleteProduct(productRepository);

    await expect(usecase.execute({ ID: 'invalid_product_id' }))
      .rejects.toThrow(new Error('The product UUID is invalid'));

    expect(productRepository.data.length).toBe(2);
  });
});
