import { Category } from '../../../entities/Category';
import { CategoryRepository } from '../../repositories/CategoryRepository';

export class UpdateCategory {
  constructor(readonly categoryRepository: CategoryRepository) {}

  async execute(input: Input): Promise<Output> {
    const category = new Category(input.title, input.description, input.ownerID, input.ID);

    await this.categoryRepository.update(category);

    return {
      ID: String(category.ID),
      title: category.title,
      description: category.description,
      ownerID: String(category.ownerID)
    };
  }
}

type Input = {
  ID: string
  title: string
  description: string
  ownerID: string
}

type Output = {
  ID: string,
  title: string,
  description: string,
  ownerID: string
}
