import { Context } from 'https://deno.land/x/oak/mod.ts'
import Access from '../handlers/Access.ts'
import DataObject from '../utils/DataObject.ts'

const { isAuthenticated, authenticate } = Access

export default class UserRules {

  public static async userAuth (ctx: Context) {
    await authenticate(ctx)
  }

  @isAuthenticated()
  public static getProfile (ctx: Context) {
    ctx.response.body.response_object = "getPRofile"
  }

  @isAuthenticated()
  public static getCharacters (ctx: Context) {

  }
}