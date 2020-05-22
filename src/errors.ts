
export class CustomError extends Error {}

export class UserAuthenticationError extends CustomError {}
export class UserSignupFailError extends CustomError {
  constructor(message: string = "User signup failed") {
    super(message)
  }
}

export class SchemaValidationError extends CustomError {}
export class ModelPayloadValidationError extends CustomError {}

export class MongoQueryError extends CustomError {}