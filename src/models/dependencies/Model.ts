import Database from '../../handlers/Database.ts'

export default class Model {
  protected static modelname: string
  protected static instance: Model

  protected handler: Database | undefined;
  protected collection: any;

  constructor(modelname: string, handler?: Database) {
    if (Model.instance) {
      return Model.instance
    } else if (!handler && !this.handler) {
      throw new Error(`${Model.modelname} Model Error: No Handler delivered, and no instance previously configured`)
    }

    Model.modelname = modelname
    this.handler = handler
    this.collection = this.handler?.getDatabase().collection(Model.modelname)
    Model.instance = this
  }

  protected static getInstance(): Model {
    return Model.instance
  }
}