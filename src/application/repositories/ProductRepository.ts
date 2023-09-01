import { Product } from '../../entities/Product';
import { UUID } from '../../entities/UUID';

export interface ProductRepository {
	save (category: Product): Promise<string>
	update (category: Product): Promise<Product>;
	delete (categoryID: UUID): Promise<void>;
}
