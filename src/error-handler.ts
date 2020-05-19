import { Status, HttpError, Context } from 'https://deno.land/x/oak/mod.ts'

export function httpErrorHandler (ctx: Context, error: HttpError): void {
  switch (error.status) {
    case Status.NotFound:
      ctx.response.status = 404
    case Status.Forbidden:
      ctx.response.status = 501
    case Status.Unauthorized:
      ctx.response.status = 401
    default:
      break;
  }
}