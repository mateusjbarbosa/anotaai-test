import { Product } from '../../../entities/Product';
import { Queue } from '../../../infrastructure/queue/Queue';
import { ProductRepository } from '../../repositories/ProductRepository';

export class RegisterProduct {
  constructor(readonly productRepository: ProductRepository, readonly queue: Queue) {}

  async execute(input: Input): Promise<Output> {
    const product = new Product(
      input.title,
      input.description,
      input.price,
      input.categoryID,
      input.ownerID
    );

    const id = await this.productRepository.save(product);
    product.ID = id;

    await this.queue.sendMessage('catalog-emit', JSON.stringify(product), 'register');

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
