import { Collection } from 'https://deno.land/x/mongo@v0.7.0/mod.ts'
import { DatabaseHandler } from '../../handlers/Database.ts'\
import { SchemaValidationError } from '../../error-handler.ts'

type SchemaAtribute = Array<SchemaAtribute> | { type?: string , default?: string | Object, null?: boolean }
type GenericObject = { [key: string]: any }
type Schema = { [key: string]: SchemaAtribute }

export default class Model {
  protected modelname: string

  protected collection: Collection | null = null;

  protected schema: Schema = {}

  constructor(modelname: string) {
    this.modelname = modelname
  }

  protected schemaToObject(): GenericObject {
    if (!this.schema) return {}

    let aux: GenericObject = {}
    const schema: Schema = this.schema

    Object.keys(this.schema).forEach(k => {
      let schemaAtb: SchemaAtribute = schema[k]

      if (Array.isArray(schemaAtb)) {
        return aux[k] = []
      } else {
        if (schemaAtb.default) {
          const type = typeof schemaAtb.default
          if (type === schemaAtb.type || (type === 'object' && (schemaAtb.default instanceof Date))) {
            return aux[k] = schemaAtb.default
          }

          throw new SchemaValidationError(`default value and attribute type mismatch: ${this.modelname}.${k}`)
        } else {
          switch(schemaAtb.type) {
            case 'string':
              return aux[k] = ""
            case 'number':
              return aux[k] = 0
            case 'date':
              return aux[k] = new Date()
            default:
              if ([undefined, true].includes(schemaAtb.null)) {
                return aux[k] = null
              } else if (!schemaAtb.default) {
                throw new SchemaValidationError(`not nullable attributes must have a 'default' value`)
              }
          }
        }
      }
    })

    return aux
  }

  protected getCollection(): Collection | null {
    if (!this.collection) {
      this.collection = DatabaseHandler.getInstance().getDatabase()?.collection(this.modelname) ?? null
    }
    return this.collection;
  }

  public async find(query: Object) {
    return this.getCollection()?.find(query)
  }

  public async findOne(query: Object) {
    return this.getCollection()?.findOne(query)
  }

  public async aggregation(pipeline: Array<Object>) {
    return this.getCollection()?.aggregate(pipeline)
  }

  public async insertOne(payload: Object) {
    return this.getCollection()?.insertOne(payload)
  }
}