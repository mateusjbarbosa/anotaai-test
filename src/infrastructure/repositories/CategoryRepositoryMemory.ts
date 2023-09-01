import { CategoryRepository } from '../../application/repositories/CategoryRepository';
import { Category } from '../../entities/Category';
import { UUID } from '../../entities/UUID';

export class CategoryRepositoryMemoryDatabase implements CategoryRepository {
  data: Category[];

  constructor() {
    this.data = [];
  }

  save(category: Category): Promise<string> {
    const categoryID = UUID.create();
    category.ID = categoryID;

    this.data.push(category);

    return new Promise(resolve => {
      resolve(categoryID);
    });
  }

  update(updatedCategory: Category): Promise<Category> {
    const categoryIndex = this.data.findIndex((category) => category.ID === updatedCategory.ID);

    if (categoryIndex < 0) throw new Error('Category not found');

    this.data[categoryIndex] = updatedCategory;

    return new Promise(resolve => {
      resolve(updatedCategory);
    });
  }

  delete(categoryID: UUID): Promise<void> {
    const categoryIndex = this.data.findIndex((category) => category.ID === categoryID);

    if (categoryIndex < 0) throw new Error('Category not found');

    this.data.splice(categoryIndex, 1);

    return new Promise(resolve => {
      resolve();
    });
  }
}
