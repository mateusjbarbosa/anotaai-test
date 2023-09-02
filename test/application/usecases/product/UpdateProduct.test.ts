import {
  RegisterCategory, RegisterCategoryOutput
} from '../../../../src/application/usecases/category/RegisterCategory';
import {
  RegisterProduct,
  RegisterProductOutput
} from '../../../../src/application/usecases/product/RegisterProduct';
import { UpdateProduct } from '../../../../src/application/usecases/product/UpdateProduct';
import { FakeQueue } from '../../../../src/infrastructure/queue/FakeQueue';
import {
  CategoryRepositoryInMemoryDatabase
} from '../../../../src/infrastructure/repositories/in-memory/CategoryRepositoryInMemory';
import {
  ProductRepositoryInMemoryDatabase
} from '../../../../src/infrastructure/repositories/in-memory/ProductRepositoryInMemory';

const ownerID = 'd49b0660-1989-4a6c-b7ae-26d2d43764a4';

const productRepository = new ProductRepositoryInMemoryDatabase();
const categoryRepository = new CategoryRepositoryInMemoryDatabase();
const fakeQueue = new FakeQueue();
let createdProduct: RegisterProductOutput;
let createdCategory: RegisterCategoryOutput;

describe('UpdateProduct usecase', () => {
  beforeAll(async () => {
    const registerCategoryUsecase = new RegisterCategory(categoryRepository);
    createdCategory = await registerCategoryUsecase.execute({
      title: 'valid_title',
      description: 'valid_description',
      ownerID,
    });

    const registerProductUsecase = new RegisterProduct(productRepository, fakeQueue);
    createdProduct = await registerProductUsecase.execute({
      title: 'valid_title',
      description: 'valid_description',
      price: 100,
      categoryID: createdCategory.id,
      ownerID,
    });
  });

  it('should update a product correctly', async () => {
    const usecase = new UpdateProduct(productRepository, fakeQueue);

    const output = await usecase.execute({
      ID: createdProduct.id,
      title: 'updated_title',
      description: 'valid_description',
      price: 100,
      categoryID: createdCategory.id,
      ownerID,
    });

    expect(output).toBeDefined();
    expect(output.title).toEqual('updated_title');
    expect(productRepository.data.length).toBe(1);
  });

  it('should throw error when product not found', async () => {
    const usecase = new UpdateProduct(productRepository, fakeQueue);

    await expect(usecase.execute({
      ID: 'fce2a477-11b2-4f8f-8f06-b34bd98074fa',
      title: 'valid_id',
      description: 'valid_description',
      price: 100,
      categoryID: createdCategory.id,
      ownerID,
    })).rejects.toThrow(
      new Error('Product not found'),
    );
    expect(productRepository.data.length).toBe(1);
  });

  it('should throw error if product title is invalid', async () => {
    const usecase = new UpdateProduct(productRepository, fakeQueue);

    // eslint-disable-next-line max-len
    const invalidTitle = 'Nostrud cupidatat qui aliquip duis voluptate non Lorem dolor minim duis dolor et magna quis';

    await expect(usecase.execute({
      ID: createdProduct.id,
      title: invalidTitle,
      description: 'valid_description',
      price: 100,
      categoryID: createdCategory.id,
      ownerID,
    })).rejects.toThrow(
      new Error('The product title must have a maximum of 50 characters'),
    );
    expect(productRepository.data.length).toBe(1);
  });
});
