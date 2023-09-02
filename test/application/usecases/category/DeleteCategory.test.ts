import { DeleteCategory } from '../../../../src/application/usecases/category/DeleteCategory';
import {
  RegisterCategory,
  RegisterCategoryOutput
} from '../../../../src/application/usecases/category/RegisterCategory';
import {
  CategoryRepositoryInMemoryDatabase
} from '../../../../src/infrastructure/repositories/in-memory/CategoryRepositoryInMemory';

const ownerID = 'd49b0660-1989-4a6c-b7ae-26d2d43764a4';

const categoryRepository = new CategoryRepositoryInMemoryDatabase();
let createdCategory: RegisterCategoryOutput;

describe('DeleteCategory usecase', () => {
  beforeEach(async () => {
    const registerCategoryUsecase = new RegisterCategory(categoryRepository);

    createdCategory = await registerCategoryUsecase.execute({
      title: 'valid_title',
      description: 'valid_description',
      ownerID,
    });
  });

  it('should delete a category correctly', async () => {
    const usecase = new DeleteCategory(categoryRepository);

    await usecase.execute({ ID: createdCategory.id });

    expect(categoryRepository.data.length).toBe(0);
  });

  it('should throw error when category not found', async () => {
    const usecase = new DeleteCategory(categoryRepository);

    await expect(usecase.execute({ ID: 'fce2a477-11b2-4f8f-8f06-b34bd98074fa' }))
      .rejects.toThrow(new Error('Category not found'));

    expect(categoryRepository.data.length).toBe(1);
  });

  it('should throw error when category ID is invalid', async () => {
    const usecase = new DeleteCategory(categoryRepository);

    await expect(usecase.execute({ ID: 'invalid_category_id' }))
      .rejects.toThrow(new Error('The category UUID is invalid'));

    expect(categoryRepository.data.length).toBe(2);
  });
});
