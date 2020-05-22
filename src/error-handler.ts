import { Status, HttpError, Context } from 'https://deno.land/x/oak/mod.ts'

import { CustomError } from './errors.ts'

export function httpErrorHandler (ctx: Context, error: HttpError | CustomError): void {
  let sendMessageError = true;
  if (error instanceof HttpError) {
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
  } else {
    sendMessageError = false
  }

  if (sendMessageError) {
    ctx.response.body = { message: error.message }
  }
}
