import IModel from './interfaces/IModel.ts'
import Database from '../handlers/Database.ts'

export default class User implements IModel {
  private readonly modelname: string = 'users'
  private static interface: User

  private handler: Database;
  private collection: any;

  constructor(handler: Database) {
    if (User.interface) return User.interface
    this.handler = handler
    this.collection = handler.collection(this.modelname)
    User.instance = this
  }

  async find(query: Object) {
    return await this.collection.find(query)
  }

  public async findOne(query: Object) {
    return await this.collection.findOne(query)
  }

  public async aggregation(pipeline: Array<Object>) {
    return await this.Collection.aggregation(pipeline)
  }
}