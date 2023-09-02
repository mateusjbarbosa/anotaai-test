import {
  RegisterCategory,
  RegisterCategoryOutput
} from '../../../../src/application/usecases/category/RegisterCategory';
import { AssociateCategory } from '../../../../src/application/usecases/product/AssociateCategory';
import {
  RegisterProduct,
  RegisterProductOutput
} from '../../../../src/application/usecases/product/RegisterProduct';
import {
  CategoryRepositoryInMemoryDatabase
} from '../../../../src/infrastructure/repositories/in-memory/CategoryRepositoryInMemory';
import {
  ProductRepositoryInMemoryDatabase
} from '../../../../src/infrastructure/repositories/in-memory/ProductRepositoryInMemory';

const ownerID = 'd49b0660-1989-4a6c-b7ae-26d2d43764a4';

const productRepository = new ProductRepositoryInMemoryDatabase();
const categoryRepository = new CategoryRepositoryInMemoryDatabase();
const registerCategoryUsecase = new RegisterCategory(categoryRepository);
let createdProduct: RegisterProductOutput;
let createdCategory: RegisterCategoryOutput;

describe('AssociateCategory usecase', () => {
  beforeAll(async () => {
    createdCategory = await registerCategoryUsecase.execute({
      title: 'valid_title',
      description: 'valid_description',
      ownerID,
    });

    const registerProductUsecase = new RegisterProduct(productRepository);
    createdProduct = await registerProductUsecase.execute({
      title: 'valid_title',
      description: 'valid_description',
      price: 100,
      categoryID: createdCategory.id,
      ownerID,
    });
  });

  it('should associate a new category with a product correctly', async () => {
    const product = await productRepository.getOne(createdProduct.id);
    const newCategory = await registerCategoryUsecase.execute({
      title: 'new_category',
      description: 'valid_description',
      ownerID,
    });
    const usecase = new AssociateCategory(categoryRepository, productRepository);

    expect(product.categoryID).toEqual(createdCategory.id);

    await usecase.execute({
      categoryID: newCategory.id,
      productID: String(product.ID)
    });

    expect(product.categoryID).toEqual(newCategory.id);
  });

  it('should throw error when category ID is invalid', async () => {
    const usecase = new AssociateCategory(categoryRepository, productRepository);

    await expect(usecase.execute({
      categoryID: 'invalid_category_id',
      productID: createdProduct.id
    }))
      .rejects.toThrow(new Error('The category UUID is invalid'));
  });

  it('should throw error when product ID is invalid', async () => {
    const usecase = new AssociateCategory(categoryRepository, productRepository);

    await expect(usecase.execute({
      categoryID: createdCategory.id,
      productID: 'invalid_product_id'
    }))
      .rejects.toThrow(new Error('The product UUID is invalid'));
  });

  it('should throw error when category not found', async () => {
    const usecase = new AssociateCategory(categoryRepository, productRepository);

    await expect(usecase.execute({
      categoryID: '78b0003f-084e-4627-bb63-d5fda7b5589f',
      productID: createdProduct.id
    }))
      .rejects.toThrow(new Error('Category not found'));
  });

  it('should throw error when product not found', async () => {
    const usecase = new AssociateCategory(categoryRepository, productRepository);

    await expect(usecase.execute({
      categoryID: createdCategory.id,
      productID: '4cc94d57-3115-48e1-8386-9f941e4eb3f7'
    }))
      .rejects.toThrow(new Error('Product not found'));
  });
});
