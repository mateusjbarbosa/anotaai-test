import { RegisterCategory } from '../../../src/application/usecases/RegisterCategory';
// eslint-disable-next-line max-len
import { CategoryRepositoryMemoryDatabase } from '../../../src/infrastructure/repositories/CategoryRepositoryMemory';

const ownerID = 'd49b0660-1989-4a6c-b7ae-26d2d43764a4';

describe('RegisterCategory usecase', () => {
  it('should register a category correctly', async () => {
    const categoryRepository = new CategoryRepositoryMemoryDatabase();
    const usecase = new RegisterCategory(categoryRepository);

    const output = await usecase.execute({
      title: 'valid_title',
      description: 'valid_description',
      ownerID,
    });

    expect(output.id).toBeDefined();
    expect(categoryRepository.data.length).toBe(1);
  });

  it('should thow error if category title is invalid', async () => {
    const categoryRepository = new CategoryRepositoryMemoryDatabase();
    const usecase = new RegisterCategory(categoryRepository);

    // eslint-disable-next-line max-len
    const invalidTitle = 'Nostrud cupidatat qui aliquip duis voluptate non Lorem dolor minim duis dolor et magna quis';

    await expect(usecase.execute({
      title: invalidTitle,
      description: 'valid_description',
      ownerID,
    })).rejects.toThrow(
      new Error('The category title must have a maximum of 50 characters'),
    );
    expect(categoryRepository.data.length).toBe(0);
  });
});
