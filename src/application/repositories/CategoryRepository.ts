import { Category } from '../../entities/Category';

export interface CategoryRepository {
	save (category: Category): Promise<string>
	update (category: Category): Promise<void>;
	delete (categoryID: string): Promise<void>;
}
