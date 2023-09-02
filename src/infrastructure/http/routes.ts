import { Request, Response, Router } from 'express';
import { DeleteCategory } from '../../application/usecases/category/DeleteCategory';
import { RegisterCategory } from '../../application/usecases/category/RegisterCategory';
import { UpdateCategory } from '../../application/usecases/category/UpdateCategory';
import { GetCatalog } from '../../application/usecases/owner/GetCatalog';
import { AssociateCategory } from '../../application/usecases/product/AssociateCategory';
import { DeleteProduct } from '../../application/usecases/product/DeleteProduct';
import { RegisterProduct } from '../../application/usecases/product/RegisterProduct';
import { UpdateProduct } from '../../application/usecases/product/UpdateProduct';
import { S3Adapter } from '../bucket/S3Adapter';
import { MongoClientAdapter } from '../database/MongoClientAdapter';
import { SQSAdapter } from '../queue/SQSAdapter';
import { CategoryRepositoryMongoDatabase } from '../repositories/mongodb/CategoryMongoDatabase';
import { ProductRepositoryMongoDatabase } from '../repositories/mongodb/ProductMongoDatabase';

const router = Router();

const connection = new MongoClientAdapter().database;
const categoryRepository = new CategoryRepositoryMongoDatabase(connection!);
const productRepository = new ProductRepositoryMongoDatabase(connection!);
const sqsQueue = new SQSAdapter();

// Categories
router.post('/categories', async (request: Request, response: Response) => {
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

router.put('/categories/:id', async (request: Request, response: Response) => {
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

router.delete('/categories/:id',async (request: Request, response:Response) => {
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
router.post('/products', async (request: Request, response: Response) => {
  const { title, description, price, categoryID, ownerID } = request.body;
  const usecase = new RegisterProduct(productRepository, sqsQueue);

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

router.put('/products/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  const { title, description, price, categoryID, ownerID } = request.body;
  const usecase = new UpdateProduct(productRepository, sqsQueue);

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

router.patch('/products/:id/associate-category', async (request: Request, response: Response) => {
  const { id: productID } = request.params;
  const { categoryID } = request.body;
  const usecase = new AssociateCategory(categoryRepository, productRepository, sqsQueue);

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

router.delete('/products/:id', async (request: Request, response:Response) => {
  const { id } = request.params;
  const usecase = new DeleteProduct(productRepository, sqsQueue);

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

router.get('/owners/:id/catalog', async (request: Request, response: Response) => {
  const { id } = request.params;

  try {
    const bucket = new S3Adapter();
    const usecase = new GetCatalog(bucket);

    const catalog = await usecase.execute({ ownerID: id });

    return response.status(200).json(catalog);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return response.status(422).json({
      message: error.message
    });
  }
});

export { router };
