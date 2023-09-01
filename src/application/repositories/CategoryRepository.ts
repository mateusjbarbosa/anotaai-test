import { Category } from '../../entities/Category';
import { UUID } from '../../entities/UUID';

export interface CategoryRepository {
	save (category: Category): Promise<string>;
  getOne (categoryID: UUID): Promise<Category>;
	update (category: Category): Promise<Category>;
	delete (categoryID: UUID): Promise<void>;
}
