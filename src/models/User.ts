import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { UserAuthenticationError } from '../error-handler.ts'
import Model from './dependencies/Model.ts';

export default class User extends Model {
  constructor() {
    super('users')
  }

  public async authenticate({ username, password }: { username: string, password: string }): Promise<any> {
    try {
      const user = await this.getCollection()?.findOne({ username })
      if (!user || !await bcrypt.compare(password, user.password)) {
        return Promise.reject(new UserAuthenticationError("Wrong Credentials"))
      }
      return user
    } catch(error) {
      console.error(`Error - MODEL - User.authenticate: ${error}`)
      throw error
    }

  }

  public async signup() {
    //TODO
  }

  private async encryptPassword(password: string) {
    // return await bcrypt.hash(password)
  }
}