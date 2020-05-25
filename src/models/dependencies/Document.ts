import Model from "./Model.ts"
import { DataDocument, Schema } from "../../types.ts"
import { ObjectId } from 'https://deno.land/x/mongo@v0.7.0/mod.ts'

/**
 * This function will build a DataDocument object based on the schema
 * of the model and the Document(s) passed.
 *
 * If the ´createDoc´ parameter is an Array, it will output an Array of DataDocument objects,
 * otherwise will only output a single document.
 * @param {Model} createModel - Model of Document to be created. Needs to be specified so we can compare the doc with the schema
 * @param {any} createDoc - Document returned from the Mongo Driver
 * @returns {(Array<DataDocument> | DataDocument)}
 */
export function create(createModel?: Model, createDoc?: any): DataDocument | Array<DataDocument> {
  let Document: DataDocument = {
    build: function(model: Model, doc: any) {
      this.model = model
      this.generateAtbs(doc)
      delete this.generateAtbs
      delete this.build
      return this
    },

    /**
     * Populates a value of a Schema which has a type 'ref' or 'ref_array'. Used to get reference for relations between models
     * @param {string} atb - Schema Attribute name which is of type 'ref' or 'ref_array'
     */
    populate: async function (atb: string) {
      let schema: Schema = this.model?.getSchema()
      let schemaAtb = schema[atb]
      if (!schemaAtb || !schemaAtb.ref || !this[atb] || !['ref', 'ref_array'].includes(schemaAtb.type)) return

      try {
        let response
        if (schemaAtb.type === 'ref_array') {
          response = this[atb].map(async (_id: ObjectId) => {
            return schema[atb].ref?.findOne({ _id })
          })
        } else {
          response = await schema[atb].ref?.findOne({ _id: this[atb] })
        }

        this[atb] = response
        return this
      } catch(error) {
        console.error('Error on Populate Instance', error)
        throw error
      }
    },
    generateAtbs: function(doc: any) {
      Object.keys(doc).map(atb => {
        this[atb] = doc[atb]
      })
    }
  }

  let response: DataDocument | Array<DataDocument> = Document
  let isArray = false
  if (createModel && Array.isArray(createDoc)) {
    isArray = true
    response = createDoc.map(doc => Document.build(createModel, doc))
  }
  return (createModel && createDoc && !isArray) ? (<DataDocument> response).build(createModel, createDoc) : response
}