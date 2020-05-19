import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Application, isHttpError, Context } from 'https://deno.land/x/oak/mod.ts';

import { httpErrorHandler } from './src/error-handler.ts'
import createRouter from './src/routes.ts';

const app = new Application();

const router = createRouter()

app.addEventListener('error', evt => {
  console.error(evt.error)
  throw evt.error
})

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    if(isHttpError(error)){
      httpErrorHandler(ctx, error)
    } else {
      throw error
    }
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: 3000 })
