
// "Private" types
type MongoType = 'string' | 'date' | 'number' | 'array' | 'ref' | 'ref_array'

// Standard Types
export type GenericObject = { [key: string]: any }

// Model and Database Related Types
export type SchemaAtribute = { type: MongoType , default?: string | Object, null?: boolean }
export type Schema = { [key: string]: SchemaAtribute }

// Validation Payload Interface Types
export interface SignupPayload { username: string, password: string }
export interface AuthenticatePayload { username: string, password: string }