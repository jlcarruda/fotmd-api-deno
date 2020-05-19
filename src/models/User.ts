import Database from '../handlers/Database.ts'
import Model from './dependencies/Model.ts';

export default class User extends Model {

  constructor(handler?: Database) {
    super('users', handler)
  }

  public async find(query: Object) {
    return await this.collection.find(query)
  }

  public async findOne(query: Object) {
    return await this.collection.findOne(query)
  }

  public async aggregation(pipeline: Array<Object>) {
    return await this.collection.aggregation(pipeline)
  }
}