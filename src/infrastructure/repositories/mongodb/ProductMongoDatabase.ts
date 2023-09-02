import { Db } from 'mongodb';
import { ProductRepository } from '../../../application/repositories/ProductRepository';
import { Product } from '../../../entities/Product';
import { UUID } from '../../../entities/UUID';

export class ProductRepositoryMongoDatabase implements ProductRepository {
  constructor(readonly connection: Db) {}

  async save(product: Product): Promise<string> {
    const result = await this.connection.collection<Product>('products').insertOne(product);

    return String(result.insertedId);
  }

  async getOne(productID: UUID): Promise<Product> {
    const result = await this.connection.collection<Product>('products').findOne({
      _id: productID
    });

    if (result) {
      const product: Product = new Product(
        result.title,
        result.description,
        result.price,
        String(result.categoryID),
        String(result.ownerID),
        String(result._id)
      );

      return product;
    } else {
      throw new Error('Category not found');
    }
  }

  async update(product: Product): Promise<Product> {
    const result = await this.connection.collection<Product>('products')
      .updateOne({ _id: product.ID }, {
        $set: product
      });

    if (result.modifiedCount > 0) {
      return product;
    } else {
      throw new Error(`Error during update ${product.ID}`);
    }
  }

  async delete(productID: UUID): Promise<void> {
    const result = await this.connection.collection<Product>('products').deleteOne({
      _id: productID
    });

    if (result.deletedCount === 0) {
      throw new Error(`Error during delete ${productID}`);
    }
  }
}
