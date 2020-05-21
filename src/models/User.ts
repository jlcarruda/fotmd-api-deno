import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { UserAuthenticationError, UsernameConflictError } from '../error-handler.ts'
import Model from './dependencies/Model.ts';

type SignupPayload = { username: string, rawPassword: string }
type AuthenticatePayload = { username: string, password: string }

export default class User extends Model {
  constructor() {
    super('users')
    this.schema = {
      username: { type: 'string' },
      password: { type: 'string' },
      characters: [],
      tables_owned: [],
      tables_participating: [],
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

  public async signup({ username, rawPassword }: SignupPayload) {
    try {
      const user = await this.findByUsername(username)
      if (user) return Promise.reject(new UsernameConflictError("Username is not available"))
      const password = await this.encryptPassword(rawPassword)

      await this.insertOne({
        username,
        password
      })
    } catch(error) {

    }
  }

  private async encryptPassword(password: string) {
    return bcrypt.hash(password)
  }

  private async findByUsername(username: string) {
    return this.getCollection()?.findOne({ username })
  }
}