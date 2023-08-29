import { UUID } from './UUID';

export class Category {
  title: string;
  description: string;
  ownerID: UUID;

  constructor(title: string, description: string, ownerID: string) {
    this.title = this.validateTitle(title);
    this.description = this.validateDescription(description);
    this.ownerID = UUID.validate(ownerID);
  }

  private validateTitle(title: string): string {
    if (title.length > 50) {
      throw new Error('The category title must have a maximum of 50 characters');
    }

    return title;
  }

  private validateDescription(description: string): string {
    if (description.length > 250) {
      throw new Error('The category description must have a maximum of 250 characters');
    }

    return description;
  }
}
