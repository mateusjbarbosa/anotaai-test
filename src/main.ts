import express, { Request, Response } from 'express';
import { DeleteCategory } from './application/usecases/category/DeleteCategory';
import { RegisterCategory } from './application/usecases/category/RegisterCategory';
import { UpdateCategory } from './application/usecases/category/UpdateCategory';
import { AssociateCategory } from './application/usecases/product/AssociateCategory';
import { DeleteProduct } from './application/usecases/product/DeleteProduct';
import { RegisterProduct } from './application/usecases/product/RegisterProduct';
import { UpdateProduct } from './application/usecases/product/UpdateProduct';
import {
  CategoryRepositoryMemoryDatabase
} from './infrastructure/repositories/CategoryRepositoryMemory';
import {
  ProductRepositoryMemoryDatabase
} from './infrastructure/repositories/ProductRepositoryMemory';

const main = () => {
  const app = express();
  const categoryRepository = new CategoryRepositoryMemoryDatabase();
  const productRepository = new ProductRepositoryMemoryDatabase();

  app.use(express.json());

  app.get('/', (_, response: Response) => {
    response.send('Hello!');
  });

  // Categories
  app.post('/categories', async (request: Request, response: Response) => {
    const { title, description, ownerID } = request.body;
    const usecase = new RegisterCategory(categoryRepository);

    try {
      const result = await usecase.execute({
        title,
        description,
        ownerID
      });

      return response.status(201).json(result);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return response.status(422).json({
        message: error.message
      });
    }
  });

  app.put('/categories/:id', async (request: Request, response: Response) => {
    const { id } = request.params;
    const { title, description, ownerID } = request.body;
    const usecase = new UpdateCategory(categoryRepository);

    try {
      const result = await usecase.execute({
        ID: id,
        title,
        description,
        ownerID
      });

      return response.status(200).json(result);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return response.status(422).json({
        message: error.message
      });
    }
  });

  app.delete('/categories/:id',async (request: Request, response:Response) => {
    const { id } = request.params;
    const usecase = new DeleteCategory(categoryRepository);

    try {
      await usecase.execute({
        ID: id
      });

      return response.status(204).end();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return response.status(422).json({
        message: error.message
      });
    }
  });

  // Products
  app.post('/products', async (request: Request, response: Response) => {
    const { title, description, price, categoryID, ownerID } = request.body;
    const usecase = new RegisterProduct(productRepository);

    try {
      const result = await usecase.execute({
        title,
        description,
        price,
        categoryID,
        ownerID
      });

      return response.status(201).json(result);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return response.status(422).json({
        message: error.message
      });
    }
  });

  app.put('/products/:id', async (request: Request, response: Response) => {
    const { id } = request.params;
    const { title, description, price, categoryID, ownerID } = request.body;
    const usecase = new UpdateProduct(productRepository);

    try {
      const result = await usecase.execute({
        ID: id,
        title,
        description,
        price,
        categoryID,
        ownerID
      });

      return response.status(200).json(result);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return response.status(422).json({
        message: error.message
      });
    }
  });

  app.patch('/products/:id/associate-category', async (request: Request, response: Response) => {
    const { id: productID } = request.params;
    const { categoryID } = request.body;
    const usecase = new AssociateCategory(categoryRepository, productRepository);

    try {
      const result = await usecase.execute({
        productID,
        categoryID
      });

      return response.status(200).json(result);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return response.status(422).json({
        message: error.message
      });
    }
  });

  app.delete('/products/:id',async (request: Request, response:Response) => {
    const { id } = request.params;
    const usecase = new DeleteProduct(productRepository);

    try {
      await usecase.execute({
        ID: id
      });

      return response.status(204).end();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return response.status(422).json({
        message: error.message
      });
    }
  });

  app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log('anotaai-test running at 3000');
  });
};

main();
