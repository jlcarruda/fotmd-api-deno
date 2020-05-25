import { ObjectId } from 'https://deno.land/x/mongo@v0.7.0/mod.ts'
import Model from './dependencies/Model.ts'
import { User } from '../models.ts'
import { DataDocument } from '../types.ts'

export default class Character extends Model {
  constructor() {
    super('characters')
    this.schema = {
      owner: { type: 'ref', ref: User },

      // Sheet
      name: { type: 'string' },
      machine_type: { type: 'string' },
      machine_model: { type: 'string' },
      system_name: { type: 'string' },
      cpu: { type: 'string' },
      energy: { type: 'number' },
      life_cycles: { type: 'number' },
      sanity: { type: 'number' },
      total_weight: { type: 'number' },
      adrenaline: { type: 'number' },
      agility: { type: 'number' },
      reflexes: { type: 'number' },
      charisma: { type: 'number' },
      dexterity: { type: 'number' },
      inteligence: { type: 'number' },
      criativity: { type: 'number' },
      persuasion: { type: 'number' },
      skill: { type: 'number' },

      //SYSTEM
      defense: { type: 'number' },
      vulnerability: { type: 'number' },

      //MOTHERBOARD
      ram: { type: 'number' },
      sd: { type: 'number' },
      refrigeration: { type: 'number' },
      powersource: { type: 'number' },
      conectors: { type: 'number' },
      ram_slots: { type: 'number' },
      sd_slots: { type: 'number' },
      wireless: { type: 'number' },

      functionalities: { type: 'array' },

      //CPU
      cpu_type: { type: 'string' },
      ghz: { type: 'number' },
      ram_cost: { type: 'number' },
      energy_cost: { type: 'number' },
      temperature: { type: 'number' },
      overclock: { type: 'number' },

      //MACHINE components
      head_components: { type: 'array' },
      left_arm_components: { type: 'array' },
      right_arm_components: { type: 'array' },
      left_leg_components: { type: 'array' },
      right_leg_components: { type: 'array' },
      body_components: { type: 'array' },

      inventory: { type: 'array' }
    }
  }

  public async findByUser(userId: ObjectId): Promise<Array<DataDocument>> {
    return this.find({ owner: userId })
  }
}