import { Category } from '../../entities/Category';
import { UUID } from '../../entities/UUID';

export interface CategoryRepository {
	save (category: Category): Promise<string>
	update (category: Category): Promise<Category>;
	delete (categoryID: UUID): Promise<void>;
}
