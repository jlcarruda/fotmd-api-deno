import { Collection } from 'https://deno.land/x/mongo@v0.7.0/mod.ts'
import { DatabaseHandler } from '../../handlers/Database.ts'
import { SchemaValidationError, MongoQueryError } from '../../error-handler.ts'

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

          throw new SchemaValidationError(`Default value and attribute type mismatch: ${this.modelname}.${k}`)
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
                throw new SchemaValidationError(`Not nullable attributes must have a 'default' value`)
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

  protected async find(query: Object) {
    try {
      const result = await this.getCollection()?.find(query)
      return result
    } catch(error) {
      console.error(error)
      return Promise.reject(new MongoQueryError(`Query execution error: ${error}`))
    }
  }

  protected async findOne(query: Object) {
    try {
      const result = await this.getCollection()?.findOne(query)
      return result
    } catch(error) {
      console.error(error)
      return Promise.reject(new MongoQueryError(`Query execution error: ${error}`))
    }
  }

  protected async aggregation(pipeline: Array<Object>) {
    try {
      const result = await this.getCollection()?.aggregate(pipeline)
      return result
    } catch(error) {
      console.error(error)
      return Promise.reject(new MongoQueryError(`Query execution error: ${error}`))
    }
  }

  protected async insertOne(payload: Object) {
    try {
      const result = await this.getCollection()?.insertOne(payload)
      return result
    } catch(error) {
      console.error(error)
      return Promise.reject(new MongoQueryError(`Query execution error: ${error}`))
    }
  }
}