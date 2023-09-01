import { Category } from '../../entities/Category';

export interface CategoryRepository {
	save (category: Category): Promise<string>
	update (category: Category): Promise<Category>;
	delete (categoryID: string): Promise<void>;
}
