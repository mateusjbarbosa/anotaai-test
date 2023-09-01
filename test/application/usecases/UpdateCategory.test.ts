import {
  RegisterCategory,
  RegisterCategoryOutput
} from '../../../src/application/usecases/RegisterCategory';
import { UpdateCategory } from '../../../src/application/usecases/UpdateCategory';
import {
  CategoryRepositoryMemoryDatabase
} from '../../../src/infrastructure/repositories/CategoryRepositoryMemory';

const ownerID = 'd49b0660-1989-4a6c-b7ae-26d2d43764a4';

const categoryRepository = new CategoryRepositoryMemoryDatabase();
let createdCategory: RegisterCategoryOutput;

describe('UpdateCategory usecase', () => {
  beforeAll(async () => {
    const registerCategoryUsecase = new RegisterCategory(categoryRepository);

    createdCategory = await registerCategoryUsecase.execute({
      title: 'valid_title',
      description: 'valid_description',
      ownerID,
    });
  });

  it('should update a category correctly', async () => {
    const usecase = new UpdateCategory(categoryRepository);

    const output = await usecase.execute({
      ID: createdCategory.id,
      title: 'updated_title',
      description: 'valid_description',
      ownerID,
    });

    expect(output).toBeDefined();
    expect(output.title).toEqual('updated_title');
    expect(categoryRepository.data.length).toBe(1);
  });

  it('should throw error when category not found', async () => {
    const usecase = new UpdateCategory(categoryRepository);

    await expect(usecase.execute({
      ID: 'fce2a477-11b2-4f8f-8f06-b34bd98074fa',
      title: 'valid_id',
      description: 'valid_description',
      ownerID,
    })).rejects.toThrow(
      new Error('Category not found'),
    );
    expect(categoryRepository.data.length).toBe(1);
  });

  it('should throw error if category title is invalid', async () => {
    const usecase = new UpdateCategory(categoryRepository);

    // eslint-disable-next-line max-len
    const invalidTitle = 'Nostrud cupidatat qui aliquip duis voluptate non Lorem dolor minim duis dolor et magna quis';

    await expect(usecase.execute({
      ID: createdCategory.id,
      title: invalidTitle,
      description: 'valid_description',
      ownerID,
    })).rejects.toThrow(
      new Error('The category title must have a maximum of 50 characters'),
    );
    expect(categoryRepository.data.length).toBe(1);
  });
});
