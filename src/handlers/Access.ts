import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Context, Status } from 'https://deno.land/x/oak/mod.ts'
import { validateJwt } from "https://deno.land/x/djwt/validate.ts"
import {
  makeJwt,
  setExpiration,
  Jose,
  Payload,
} from "https://deno.land/x/djwt/create.ts"

import DataObject from "../utils/DataObject.ts";

export default class Access {

  private static readonly sessionSign = Deno.env.get('SESSION_SIGN') ?? config()['SESSION_SIGN']

  //TODO: Refactor to make this function validate payloads previously
  private static validateBody(body: any): Boolean {
    const keys = Object.keys(body)
    return keys.includes('username') && keys.includes('password')
  }

  public static async authenticate(ctx : Context) {
    const { request } = ctx
    try {
      const { value } = await request.body()
      ctx.assert(Access.validateBody(value), Status.Unauthorized)

      // Verify if user exists

      const payload: Payload = {
        iss: "fotmd-API",
        sub: value.username,
        user: value.username,
        exp: setExpiration(new Date().getTime() + 60 * 60 * 1000)
      }

      const header: Jose = {
        alg:"HS512",
        typ: "JWT"
      }

      ctx.response.body = {
        token: makeJwt({ key: Access.sessionSign, header, payload })
      }
    } catch (error) {
      ctx.throw(500)
    }
  }

  public static authorize (ctx: Context, data: DataObject) {
    //TODO
  }

  // DECORATORS
  public static isAuthenticated (role?: string): Function {
    if (!Access.sessionSign) throw new Error("Session Secret is not defined")
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      let originalMethod = descriptor.value

      descriptor.value = async function (...args: any[]) {
        const [ context, data ] = args

        let { request } = context
        const hasBearer = request.headers.get('Authorization')?.split(' ')[0] === 'Bearer'
        const jwt = (request.headers.get('Authorization')?.match(/[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/) ?? [])[0]

        context.assert(hasBearer && jwt, 401, "Unauthorized")

        const decoded = await validateJwt(jwt, Access.sessionSign, { isThrowing: false })

        context.assert(decoded, 401, "Unauthorized")

        data.auth = decoded
        context.response.body = decoded

        let result = originalMethod.apply(this, [context, data])
        return result
      }
    }
  }
}