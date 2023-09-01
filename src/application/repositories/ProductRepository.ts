import { Product } from '../../entities/Product';
import { UUID } from '../../entities/UUID';

export interface ProductRepository {
	save (product: Product): Promise<string>
  getOne (productID: UUID): Promise<Product>
	update (product: Product): Promise<Product>;
	delete (productID: UUID): Promise<void>;
}
