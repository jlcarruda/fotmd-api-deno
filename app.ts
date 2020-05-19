import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Application, isHttpError } from 'https://deno.land/x/oak/mod.ts';

import { httpErrorHandler } from './src/error-handler.ts'
import createRouter from './src/routes.ts';
import Database from './src/handlers/Database.ts'

const { DB_URI, DB_NAME, PORT } = config()

const app = new Application();
const database = new Database(DB_URI);

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

await database.connect(DB_NAME)
await app.listen({ port: Number(PORT) || 3000 })
