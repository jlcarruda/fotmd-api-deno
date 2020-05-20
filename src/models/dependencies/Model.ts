import { Collection } from 'https://deno.land/x/mongo@v0.7.0/mod.ts'
import { DatabaseHandler } from '../../handlers/Database.ts'

export default class Model {
  protected modelname: string

  protected collection: Collection | null = null;

  constructor(modelname: string) {
    this.modelname = modelname
  }

  protected getCollection(): Collection | null {
    if (!this.collection) {
      this.collection = DatabaseHandler.getInstance().getDatabase()?.collection(this.modelname) ?? null
    }
    return this.collection;
  }
}