import { Category } from '../../../entities/Category';
import { CategoryRepository } from '../../repositories/CategoryRepository';

export class RegisterCategory {
  constructor(readonly categoryRepository: CategoryRepository) {}

  async execute(input: Input): Promise<Output> {
    const category = new Category(input.title, input.description, input.ownerID);

    const id = await this.categoryRepository.save(category);

    return { id };
  }
}

type Input = {
  title: string
  description: string
  ownerID: string
}

type Output = {
  id: string
}

export { Output as RegisterCategoryOutput };
