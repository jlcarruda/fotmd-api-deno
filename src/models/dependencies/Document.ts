import Model from "./Model.ts"
import { DataDocument, Schema } from "../../types.ts"

export function create(model?: Model, doc?: any) {
  let Document: DataDocument = {
    build: function(model: Model, doc: any) {
      this.model = model
      this.generateAtbs(doc)
      return this
    },
    populate: async function (atb: string) {
      let schema: Schema = this.model?.getSchema()
      if (!schema[atb] || !schema[atb].ref || !this[atb] || !['ref', 'ref_array'].includes(schema[atb].type)) return

      try {
        const response = await schema[atb].ref?.findOne({ _id: this[atb] })
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

  return (model && doc) ? Document.build(model, doc) : Document
}