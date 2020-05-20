import { DatabaseHandler } from '../handlers/Database.ts'
import Model from './dependencies/Model.ts';

export class User extends Model {

  constructor() {
    super('users')
  }

  public async find(query: Object) {
    return await this.getCollection()?.find(query)
  }

  public async findOne(query: Object) {
    return await this.getCollection()?.findOne(query)
  }

  public async aggregation(pipeline: Array<Object>) {
    return await this.getCollection()?.aggregate(pipeline)
  }
}