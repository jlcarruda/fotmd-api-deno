import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Application, isHttpError } from 'https://deno.land/x/oak/mod.ts';

import { httpErrorHandler } from './src/error-handler.ts'
import { createRouter } from './src/routes.ts';
import { setupConnections } from './src/connect.ts'

const { PORT } = config()

const app = new Application();

const router = createRouter()

await setupConnections()

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

await app.listen({ port: Number(PORT) || 3000 })
