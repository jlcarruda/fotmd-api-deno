import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

import { UserAuthenticationError, UserSignupFailError } from '../errors.ts'
import Model from './dependencies/Model.ts';
import { SignupPayload, AuthenticatePayload } from '../types.ts'

export default class User extends Model {
  constructor() {
    super('users')
    this.schema = {
      username: { type: 'string' },
      password: { type: 'string' },
      characters: { type: 'array' },
      tables_owned: { type: 'array' },
      tables_participating: { type: 'array' },
      created_at: { type: 'date', default: new Date() },
      updated_at: { type: 'date', default: new Date() }
    }
  }

  public async authenticate({ username, password }: AuthenticatePayload): Promise<any> {
    try {
      const user = await this.findByUsername(username)
      if (!user || !await bcrypt.compare(password, user.password)) {
        return Promise.reject(new UserAuthenticationError("Wrong Credentials"))
      }
      return user
    } catch(error) {
      console.error(`Error - MODEL - User.authenticate: ${error}`)
      throw error
    }
  }

  public async signup({ username, password }: SignupPayload) {
    try {
      /**
       * NOTE: Mongo Plugin does not throw the Rust error to Deno. It will crash the server with a Rust error if
       * username already exists and we try to insert it. Checking username first
       */
      const user = await this.findByUsername(username)
      if (user) return Promise.reject(new UserSignupFailError("Username not valid or unavailable"))

      const encryptedPassword = await this.encryptPassword(password)

      const insertedId = await this.insertOne({
        username,
        password: encryptedPassword
      })

      if (!insertedId) {
        return Promise.reject(new UserSignupFailError())
      }

      return insertedId
    } catch(error) {
      throw error
    }
  }

  private async encryptPassword(password: string) {
    return bcrypt.hash(password)
  }

  private async findByUsername(username: string) {
    return this.getCollection()?.findOne({ username })
  }
}