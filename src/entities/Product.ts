import { UUID } from './UUID';

export class Product {
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
  ) {
    this.title = this.validateTitle(title);
    this.description = this.validateDescription(description);
    this.price = this.validatePrice(price);
    this.categoryID = UUID.validate(categoryID);
    this.ownerID = UUID.validate(ownerID);
  }

  private validateTitle(title: string): string {
    if (title.length > 50) {
      throw new Error('The product title must have a maximum of 50 characters');
    }

    return title;
  }

  private validateDescription(description: string): string {
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
