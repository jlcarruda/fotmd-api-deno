import { MongoClient } from "https://deno.land/x/mongo@v0.7.0/mod.ts";

export default class Database {

  private static instance: Database;

  private database: any;
  private name: string = "";
  private uri: string = "";
  private readonly client: MongoClient = new MongoClient()

  constructor(uri: string) {
    if (Database.instance) return Database.instance
    this.uri = uri
    Database.instance = this
  }

  static getInstance(): Database {
    return Database.instance
  }

  getUri(): string {
    return this.uri
  }

  setUri(uri: string): void {
    this.uri = uri
  }

  getDatabase() {
    return this.database
  }

  getDatabaseName(): string {
    return this.name
  }

  async connect(databaseName: string) {
    if (this.name) {
      throw new Error("DatabaseHandlerError: already connected to database")
    }
    try {
      this.name = databaseName
      this.client.connectWithUri(this.uri)
      this.changeDatabase(this.name)
      console.log(`Connected with mongo ${this.uri} in database ${this.name}`)
      return Promise.resolve()
    } catch (error) {
      console.error(`Error while trying to connect to mongo: ${error.message}`)
    }
  }

  changeDatabase(databaseName: string) {
    this.name = databaseName
    this.database = this.client.database(this.name)
  }
}