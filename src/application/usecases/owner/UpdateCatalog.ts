import { Product } from '../../../entities/Product';
import { UUID } from '../../../entities/UUID';
import { Bucket } from '../../../infrastructure/bucket/Bucket';
import { CategoryRepository } from '../../repositories/CategoryRepository';
import { ProductRepository } from '../../repositories/ProductRepository';

export class UpdateCatalog {
  constructor(
    readonly bucket: Bucket,
    readonly categoryRepository: CategoryRepository,
    readonly productRepository: ProductRepository
  ) {}

  async execute(input: Input) {
    const ownerCatalogFile = `catalog-${input.product.ownerID}.json`;
    const ownerCatalog = await this.prepareOwnerCatalogObject(
      input.product.ownerID,
      ownerCatalogFile
    );

    switch (input.action) {
      case 'register':
        await this.registerProductInCatalog(input.product, ownerCatalog);
        break;
      case 'update':
        await this.updateProductInCatalog(input.product, ownerCatalog);
        break;
      case 'associate-category':
        await this.associateNewProductCategoryInCatalog(input.product, ownerCatalog);
        break;
      case 'delete':
        await this.deleteProductInCatalog(input.product, ownerCatalog);
        break;
      default:
        throw new Error('UpdateCatalog action not found');
    }

    await this.bucket.createObject(
      'anotaai-test-catalog',
      ownerCatalogFile,
      JSON.stringify(ownerCatalog)
    );
  }

  private async prepareOwnerCatalogObject(ownerID: UUID, ownerCatalogFile: string) {
    const bucketObjects = await this.bucket.listObjects('anotaai-test-catalog');
    let catalog: Catalog;

    if (bucketObjects.includes(`catalog-${ownerID}.json`)) {
      const result = await this.bucket.getObject('anotaai-test-catalog', ownerCatalogFile);
      catalog = JSON.parse(result);
    } else {
      catalog = {
        owner: String(ownerID),
        catalog: []
      };
    }

    return catalog;
  }

  private async getCategoryInCatalog(categoryID: UUID, ownerCatalog: Catalog) {
    const category = await this.categoryRepository.getOne(categoryID);

    const position = ownerCatalog.catalog.findIndex(item => {
      return item.category_title === category.title;
    });

    return { category, position };
  }

  private getProductCategoryPositionInCatalog(productTitle: string, ownerCatalog: Catalog) {
    return ownerCatalog.catalog.findIndex(category => {
      return category.itens.some(product => product.title === productTitle);
    });
  }

  private getProductPositionInCategoryInCatalog(
    productTitle: string,
    categoryPosition: number,
    ownerCatalog: Catalog
  ) {
    return ownerCatalog.catalog[categoryPosition].itens.findIndex(product => {
      return product.title === productTitle;
    });
  }

  private removeProductOfOldCategoryInCatalog(productTitle: string, ownerCatalog: Catalog) {
    const oldCategoryPosition = this.getProductCategoryPositionInCatalog(
      productTitle,
      ownerCatalog
    );

    if (oldCategoryPosition >= 0) {
      const productPositionInOldCategory = this.getProductPositionInCategoryInCatalog(
        productTitle,
        oldCategoryPosition,
        ownerCatalog
      );

      if (productPositionInOldCategory >= 0) {
        ownerCatalog.catalog[oldCategoryPosition].itens.splice(productPositionInOldCategory, 1);
      }
    } else {
      throw new Error('Product not found in catalog');
    }
  }

  private async registerProductInCatalog(product: Product, ownerCatalog: Catalog) {
    const { category, position } = await this.getCategoryInCatalog(
      product.categoryID,
      ownerCatalog
    );

    if (position >= 0) {
      ownerCatalog.catalog[position].itens.push({
        title: product.title,
        description: product.description,
        price: product.price
      });
    } else {
      ownerCatalog.catalog.push({
        category_title: category.title,
        category_description: category.description,
        itens: [{
          title: product.title,
          description: product.description,
          price: product.price
        }]
      });
    }
  }

  private async updateProductInCatalog(product: Product, ownerCatalog: Catalog) {
    const categoryPosition = this.getProductCategoryPositionInCatalog(
      product.title,
      ownerCatalog
    );

    if (categoryPosition >= 0) {
      const productPosition = this.getProductPositionInCategoryInCatalog(
        product.title,
        categoryPosition,
        ownerCatalog
      );

      if (productPosition >= 0) {
        ownerCatalog.catalog[categoryPosition].itens[productPosition] = product;
      }
    } else {
      throw new Error('Product not found in catalog');
    }
  }

  private async associateNewProductCategoryInCatalog(product: Product, ownerCatalog: Catalog) {
    this.removeProductOfOldCategoryInCatalog(product.title, ownerCatalog);
    await this.registerProductInCatalog(product, ownerCatalog);
  }

  private async deleteProductInCatalog(removedProduct: Product, ownerCatalog: Catalog) {
    const { position } = await this.getCategoryInCatalog(removedProduct.categoryID, ownerCatalog);

    if (position >= 0) {
      const productPosition = ownerCatalog.catalog[position]
        .itens.findIndex(item => {
          return item.title === removedProduct.title;
        });

      if(productPosition >= 0) {
        ownerCatalog.catalog[position].itens.splice(productPosition, 1);
      }
    }
  }
}

export type UpdateCatalogAction = 'register' | 'update' | 'associate-category' | 'delete'

type Input = {
  action: UpdateCatalogAction
  product: Product
}

type CatalogProduct = {
  title: string
  description: string
  price: number
}

type CatalogCategory = {
  category_title: string
  category_description: string
  itens: CatalogProduct[]
}

type Catalog = {
  owner: string
  catalog: CatalogCategory[]
}
