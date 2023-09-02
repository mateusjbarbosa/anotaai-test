import { Product } from '../../../entities/Product';
import { ProductRepository } from '../../repositories/ProductRepository';

export class RegisterProduct {
  constructor(readonly productRepository: ProductRepository) {}

  async execute(input: Input): Promise<Output> {
    const product = new Product(
      input.title,
      input.description,
      input.price,
      input.categoryID,
      input.ownerID
    );

    const id = await this.productRepository.save(product);

    return {
      id
    };
  }
}

type Input = {
  title: string
  description: string
  price: number
  categoryID: string
  ownerID: string
}

type Output = {
  id: string
}

export { Output as RegisterProductOutput };
