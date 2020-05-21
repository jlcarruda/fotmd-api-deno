import { Status, HttpError, Context } from 'https://deno.land/x/oak/mod.ts'

export function httpErrorHandler (ctx: Context, error: HttpError): void {
  let sendMessageError = true;
  switch (error.status) {
    case Status.NotFound:
      ctx.response.status = 404
      break;
    case Status.Forbidden:
      ctx.response.status = 501
      break;
    case Status.Unauthorized:
      ctx.response.status = 401
      break;
    case Status.Conflict:
      ctx.response.status = 409
      break;
    default:
      sendMessageError = false
      break;
  }

  if (sendMessageError) {
    ctx.response.body = { message: error.message }
  }
}

export class UserAuthenticationError extends Error {}
export class UserSignupFailError extends Error {
  constructor(message: string = "User signup failed") {
    super(message)
  }
}

export class SchemaValidationError extends Error {}

export class MongoQueryError extends Error {}