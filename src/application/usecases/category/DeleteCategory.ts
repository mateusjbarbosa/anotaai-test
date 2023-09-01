import { UUID } from '../../../entities/UUID';
import { CategoryRepository } from '../../repositories/CategoryRepository';

export class DeleteCategory {
  constructor(readonly categoryRepository: CategoryRepository) {}

  async execute(input: Input): Promise<void> {
    const { ID } = input;

    const categoryID = UUID.validate(ID, 'category');

    await this.categoryRepository.delete(categoryID);
  }
}

type Input = {
  ID: string
}
