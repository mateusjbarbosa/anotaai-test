import { UUID } from './UUID';

export class Product {
  private _ID?: UUID;
  title: string;
  description: string;
  price: number;
  categoryID: UUID;
  ownerID: UUID;

  constructor(
    title: string,
    description: string,
    price: number,
    categoryID: string,
    ownerID: string,
    ID?: string
  ) {
    if (ID) this._ID = UUID.validate(ID, 'product');
    this.title = this.validateTitle(title);
    this.description = this.validateDescription(description);
    this.price = this.validatePrice(price);
    this.categoryID = UUID.validate(categoryID, 'category');
    this.ownerID = UUID.validate(ownerID, 'owner');
  }

  public get ID(): UUID | undefined {
    return this._ID;
  }

  public set ID(uuid: string) {
    this._ID = UUID.validate(uuid, 'product');
  }

  private validateTitle(title: string): string {
    if (!title) {
      throw new Error('The product title is required');
    }

    if (title.length > 50) {
      throw new Error('The product title must have a maximum of 50 characters');
    }

    return title;
  }

  private validateDescription(description: string): string {
    if (!description) {
      throw new Error('The product description is required');
    }

    if (description.length > 250) {
      throw new Error('The product description must have a maximum of 250 characters');
    }

    return description;
  }

  private validatePrice(price: number): number {
    if (price < 0) throw new Error('The product price must be positive');

    return price;
  }
}
