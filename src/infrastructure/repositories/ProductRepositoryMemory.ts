import { ProductRepository } from '../../application/repositories/ProductRepository';
import { Product } from '../../entities/Product';
import { UUID } from '../../entities/UUID';

export class ProductRepositoryMemoryDatabase implements ProductRepository {
  data: Product[];

  constructor() {
    this.data = [];
  }

  save(product: Product): Promise<string> {
    const productID = UUID.create();
    product.ID = productID;

    this.data.push(product);

    return new Promise(resolve => {
      resolve(productID);
    });
  }

  update(updatedProduct: Product): Promise<Product> {
    const productIndex = this.data.findIndex((product) => product.ID === updatedProduct.ID);

    if (productIndex < 0) throw new Error('Product not found');

    this.data[productIndex] = updatedProduct;

    return new Promise(resolve => {
      resolve(updatedProduct);
    });
  }

  delete(productID: UUID): Promise<void> {
    const productIndex = this.data.findIndex((product) => product.ID === productID);

    if (productIndex < 0) throw new Error('Product not found');

    this.data.splice(productIndex, 1);

    return new Promise(resolve => {
      resolve();
    });
  }
}
