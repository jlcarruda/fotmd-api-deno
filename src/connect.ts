import { config } from "https://deno.land/x/dotenv/mod.ts";
import { DatabaseHandler } from './handlers/Database.ts'

const { DB_URI, DB_NAME } = config()

export async function setupConnections() {
  try {
    console.log(`Setting Up Connection to Database`)
    if (!DatabaseHandler.hasInstance()) {
      await DatabaseHandler.getInstance(DB_URI).connect(DB_NAME)
    }
  } catch(error) {
    console.error(`Error on setupConnection: ${error}`)
    return Promise.reject(error)
  }
}