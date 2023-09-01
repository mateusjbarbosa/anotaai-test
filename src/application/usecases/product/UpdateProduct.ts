import { Product } from '../../../entities/Product';
import { ProductRepository } from '../../repositories/ProductRepository';

export class UpdateProduct {
  constructor(readonly productRepository: ProductRepository) {}

  async execute(input: Input): Promise<Output> {
    const product = new Product(
      input.title,
      input.description,
      input.price,
      input.categoryID,
      input.ownerID,
      input.ID
    );

    await this.productRepository.update(product);

    return {
      ID: String(product.ID),
      title: product.title,
      description: product.description,
      price: product.price,
      categoryID: String(product.categoryID),
      ownerID: String(product.ownerID)
    };
  }
}

type Input = {
  ID: string
  title: string
  description: string
  price: number
  categoryID: string
  ownerID: string
}

type Output = Input
