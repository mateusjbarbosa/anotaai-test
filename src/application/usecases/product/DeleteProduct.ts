import { UUID } from '../../../entities/UUID';
import { ProductRepository } from '../../repositories/ProductRepository';

export class DeleteProduct {
  constructor(readonly productRepository: ProductRepository) {}

  async execute(input: Input): Promise<void> {
    const { ID } = input;

    const productID = UUID.validate(ID, 'product');

    await this.productRepository.delete(productID);
  }
}

type Input = {
  ID: string
}
