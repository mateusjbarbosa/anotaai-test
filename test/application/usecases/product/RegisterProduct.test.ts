import {
  RegisterCategory,
  RegisterCategoryOutput
} from '../../../../src/application/usecases/category/RegisterCategory';
import { RegisterProduct } from '../../../../src/application/usecases/product/RegisterProduct';
import { FakeQueue } from '../../../../src/infrastructure/queue/FakeQueue';
import {
  CategoryRepositoryInMemoryDatabase
} from '../../../../src/infrastructure/repositories/in-memory/CategoryRepositoryInMemory';
import {
  ProductRepositoryInMemoryDatabase
} from '../../../../src/infrastructure/repositories/in-memory/ProductRepositoryInMemory';

const categoryRepository = new CategoryRepositoryInMemoryDatabase();
const fakeQueue = new FakeQueue();
const ownerID = 'd49b0660-1989-4a6c-b7ae-26d2d43764a4';
let createdCategory: RegisterCategoryOutput;

describe('RegisterProduct usecase', () => {
  beforeAll(async () => {
    const registerCategoryUsecase = new RegisterCategory(categoryRepository);
    createdCategory = await registerCategoryUsecase.execute({
      title: 'valid_title',
      description: 'valid_description',
      ownerID,
    });
  });

  it('should register a product correctly', async () => {
    const productRepository = new ProductRepositoryInMemoryDatabase();
    const usecase = new RegisterProduct(productRepository, fakeQueue);

    const output = await usecase.execute({
      title: 'valid_title',
      description: 'valid_description',
      price: 100,
      categoryID: createdCategory.id,
      ownerID,
    });

    expect(output.id).toBeDefined();
    expect(productRepository.data.length).toBe(1);
  });

  it('should thow error if product title is invalid', async () => {
    const productRepository = new ProductRepositoryInMemoryDatabase();
    const usecase = new RegisterProduct(productRepository, fakeQueue);

    // eslint-disable-next-line max-len
    const invalidTitle = 'Nostrud cupidatat qui aliquip duis voluptate non Lorem dolor minim duis dolor et magna quis';

    await expect(usecase.execute({
      title: invalidTitle,
      description: 'valid_description',
      price: 100,
      categoryID: createdCategory.id,
      ownerID,
    })).rejects.toThrow(
      new Error('The product title must have a maximum of 50 characters'),
    );
    expect(productRepository.data.length).toBe(0);
  });
});
