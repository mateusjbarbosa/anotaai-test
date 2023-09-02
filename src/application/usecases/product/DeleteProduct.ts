import { UUID } from '../../../entities/UUID';
import { Queue } from '../../../infrastructure/queue/Queue';
import { ProductRepository } from '../../repositories/ProductRepository';

export class DeleteProduct {
  constructor(readonly productRepository: ProductRepository, readonly queue: Queue) {}

  async execute(input: Input): Promise<void> {
    const { ID } = input;

    const productID = UUID.validate(ID, 'product');

    const product = await this.productRepository.getOne(productID);
    await this.productRepository.delete(productID);

    await this.queue.sendMessage('catalog-emit', JSON.stringify(product), 'delete');
  }
}

type Input = {
  ID: string
}
