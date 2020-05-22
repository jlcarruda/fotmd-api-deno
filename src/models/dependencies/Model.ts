import { Collection } from 'https://deno.land/x/mongo@v0.7.0/mod.ts'
import { DatabaseHandler } from '../../handlers/Database.ts'
import { SchemaValidationError, MongoQueryError, ModelPayloadValidationError } from '../../errors.ts'
import { 
  SchemaAtribute,
  GenericObject,
  Schema
} from '../../types.ts'

export default class Model {
  protected modelname: string

  protected collection: Collection | null = null;

  protected schema: Schema = {}

  constructor(modelname: string) {
    this.modelname = modelname
  }

  protected validatePayload(payload: GenericObject) {
    if (!this.schema) throw new ModelPayloadValidationError(`Schema from model ${this.modelname} is not set`)
    const keys = Object.keys(this.schema)
    for (let i in keys) {
      let key = keys[i]
      let atb: SchemaAtribute = this.schema[key]
      let payloadAtb = payload[key]
      if (payloadAtb !== undefined) {
        if (Array.isArray(payloadAtb) && atb.type !== 'array') {
          throw new ModelPayloadValidationError(`Payload passed is not in compliance with the schema. Key '${key}' of payload should be an Array.`)
        } else if (payloadAtb instanceof Date && atb.type !== 'date') {
          throw new ModelPayloadValidationError(`Payload passed is not in compliance with the schema. Key '${key}' of payload should be a Date.`)
        } else if (payloadAtb instanceof Number && atb.type !== 'number') {
          throw new ModelPayloadValidationError(`Payload passed is not in compliance with the schema. Key '${key}' of payload should be a Number.`)
        } else if (typeof payloadAtb !== atb.type ) {
          throw new ModelPayloadValidationError(`Payload passed is not in compliance with the schema. Key '${key}' of payload should be a String.`)
        }
      } else if (atb.null === false) {
        throw new ModelPayloadValidationError(`Payload passed is not in compliance with the schema. Key '${key}' of payload should not be undefined or null.`)
      }
    }
  }

  protected schemaToObject(): GenericObject {
    if (!this.schema) return {}

    let aux: GenericObject = {}
    const schema: Schema = this.schema

    Object.keys(this.schema).forEach(k => {
      let schemaAtb: SchemaAtribute = schema[k]

      if (schemaAtb.default) {
        const type = typeof schemaAtb.default
        if (type === schemaAtb.type || (type === 'object' && (schemaAtb.default instanceof Date))) {
          return aux[k] = schemaAtb.default
        }
        throw new SchemaValidationError(`Default value and attribute type mismatch: ${this.modelname}.${k}`)

      } else if (schemaAtb.null === false) {
        throw new SchemaValidationError(`Not nullable attributes must have a 'default' value`)

      } else {
        switch(schemaAtb.type) {
          case 'array':
            return aux[k] = []
          default:
            aux[k] = null
        }
      }
    })

    return aux
  }

  public getCollection(): Collection | null {
    if (!this.collection) {
      this.collection = DatabaseHandler.getInstance().getDatabase()?.collection(this.modelname) ?? null
    }
    return this.collection;
  }

  public async find(query: Object) {
    try {
      const result = await this.getCollection()?.find(query)
      return result
    } catch(error) {
      console.error(error)
      return Promise.reject(new MongoQueryError(`Query execution error: ${error}`))
    }
  }

  public async findOne(query: Object) {
    try {
      const result = await this.getCollection()?.findOne(query)
      return result
    } catch(error) {
      console.error(error)
      return Promise.reject(new MongoQueryError(`Query execution error: ${error}`))
    }
  }

  public async aggregation(pipeline: Array<Object>) {
    try {
      const result = await this.getCollection()?.aggregate(pipeline)
      return result
    } catch(error) {
      console.error(error)
      return Promise.reject(new MongoQueryError(`Query execution error: ${error}`))
    }
  }

  public async insertOne(payload: GenericObject) {
    try {
      this.validatePayload(payload)
      const result = await this.getCollection()?.insertOne({
        ...this.schemaToObject(),
        ...payload
      })
      return result
    } catch(error) {
      console.error(error)
      return Promise.reject(new MongoQueryError(`Query execution error: ${error}`))
    }
  }
}