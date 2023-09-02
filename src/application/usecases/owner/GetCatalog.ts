import { Bucket } from '../../../infrastructure/bucket/Bucket';

export class GetCatalog {
  constructor(readonly bucket: Bucket) {}

  async execute(input: Input): Promise<string> {
    const ownerCatalogFile = `catalog-${input.ownerID}.json`;

    const result = await this.bucket.getObject('anotaai-test-catalog', ownerCatalogFile);

    return JSON.parse(result);
  }
}

type Input = {
  ownerID: string
}
