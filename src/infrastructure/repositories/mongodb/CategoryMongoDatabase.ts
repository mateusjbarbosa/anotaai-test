import { Db } from 'mongodb';
import { CategoryRepository } from '../../../application/repositories/CategoryRepository';
import { Category } from '../../../entities/Category';
import { UUID } from '../../../entities/UUID';

export class CategoryRepositoryMongoDatabase implements CategoryRepository {
  constructor(readonly connection: Db) {}

  async save(category: Category): Promise<string> {
    const result = await this.connection.collection<Category>('categories').insertOne(category);

    return String(result.insertedId);
  }

  async getOne(categoryID: UUID): Promise<Category> {
    const result = await this.connection.collection<Category>('categories').findOne({
      _id: categoryID
    });

    if (result) {
      const category: Category = new Category(
        result.title,
        result.description,
        String(result.ownerID),
        String(result._id)
      );

      return category;
    } else {
      throw new Error('Category not found');
    }
  }

  async update(category: Category): Promise<Category> {
    const result = await this.connection.collection<Category>('categories')
      .updateOne({ _id: category.ID }, {
        $set: category
      });

    if (result.modifiedCount > 0) {
      return category;
    } else {
      throw new Error(`Error during update ${category.ID}`);
    }
  }

  async delete(categoryID: UUID): Promise<void> {
    const result = await this.connection.collection<Category>('categories').deleteOne({
      _id: categoryID
    });

    if (result.deletedCount === 0) {
      throw new Error(`Error during delete ${categoryID}`);
    }
  }
}
