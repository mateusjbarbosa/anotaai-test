import { Category } from '../../entities/Category';

export interface CategoryRepository {
	save (category: Category): Promise<string>
	get (categoryID: string): Promise<Category>;
	update (category: Category): Promise<void>;
	delete (categoryID: string): Promise<void>;
}
