import { Context } from 'https://deno.land/x/oak/mod.ts'
import { User, Character } from '../models.ts'
import Access from '../handlers/Access.ts'
import { UserSignupFailError } from '../errors.ts'
import { SignupPayload, DataDocument } from '../types.ts'
import DataObject from '../utils/DataObject.ts'

const { isAuthenticated, authenticate } = Access

export default class UserRules {

  public static async userAuth (ctx: Context) {
    await authenticate(ctx)
  }

  public static async signup (ctx: Context) {
    try {
      const body = await ctx.request.body()
      const payload: SignupPayload = body.value
      const inserted = await User.signup(payload)
      if (!inserted) return Promise.reject(new UserSignupFailError())
      ctx.response.body = {
        message: "User signed up Successfully"
      }
      return authenticate(ctx)
    } catch(error) {
      if (error instanceof UserSignupFailError) {
        ctx.throw(409, error.message)
      }
    }
  }

  @isAuthenticated()
  public static getProfile (ctx: Context) {
    ctx.response.body.response_object = "getProfile"
  }

  @isAuthenticated()
  public static async getCharacters (ctx: Context, data: DataObject) {
    try {
      const user: DataDocument = await User.findByUsername(data.auth?.username)
      const characters: Array<DataDocument> = await Character.findByUser(user._id)
      ctx.response.body = {
        data: user,
        included: characters
      }
    } catch (error) {
      console.error("Error while retrieving Characters from User", error)
      throw error
    }
  }
}