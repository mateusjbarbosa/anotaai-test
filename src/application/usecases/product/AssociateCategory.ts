import { UUID } from '../../../entities/UUID';
import { Queue } from '../../../infrastructure/queue/Queue';
import { CategoryRepository } from '../../repositories/CategoryRepository';
import { ProductRepository } from '../../repositories/ProductRepository';

export class AssociateCategory {
  constructor(
    readonly categoryRepository: CategoryRepository,
    readonly productRepository: ProductRepository,
    readonly queue: Queue
  ) {}

  async execute(input: Input): Promise<Output> {
    const categoryID = UUID.validate(input.categoryID, 'category');
    const productID = UUID.validate(input.productID, 'product');
    const category = await this.categoryRepository.getOne(categoryID);
    const product = await this.productRepository.getOne(productID);

    product.categoryID = category.ID!;

    const updatedProduct = await this.productRepository.update(product);

    await this.queue.sendMessage('catalog-emit', JSON.stringify(updatedProduct), 'update');

    return {
      ID: String(updatedProduct.ID),
      title: updatedProduct.title,
      description: updatedProduct.description,
      price: updatedProduct.price,
      categoryID: String(updatedProduct.categoryID),
      ownerID: String(updatedProduct.ownerID)
    };
  }
}

type Input = {
  productID: string,
  categoryID: string
}

type Output = {
  ID: string,
  title: string,
  description: string,
  price: number,
  categoryID: string,
  ownerID: string
}
