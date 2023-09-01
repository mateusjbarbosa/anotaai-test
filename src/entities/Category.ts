import { UUID } from './UUID';

export class Category {
  private _ID?: UUID;
  title: string;
  description: string;
  ownerID: UUID;

  constructor(title: string, description: string, ownerID: string, ID?: string) {
    if (ID) this._ID = UUID.validate(ID, 'category');
    this.title = this.validateTitle(title);
    this.description = this.validateDescription(description);
    this.ownerID = UUID.validate(ownerID, 'owner');
  }

  public get ID(): UUID | undefined {
    return this._ID;
  }

  public set ID(uuid: string) {
    this._ID = UUID.validate(uuid, 'category');
  }

  private validateTitle(title: string): string {
    if(!title) {
      throw new Error('The category title is required');
    }

    if (title.length > 50) {
      throw new Error('The category title must have a maximum of 50 characters');
    }

    return title;
  }

  private validateDescription(description: string): string {
    if(!description) {
      throw new Error('The category description is required');
    }

    if (description.length > 250) {
      throw new Error('The category description must have a maximum of 250 characters');
    }

    return description;
  }
}
