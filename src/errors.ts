
export class CustomError extends Error {}

export class CrashingError extends Error {}

export class UserAuthenticationError extends CustomError {}
export class UserSignupFailError extends CustomError {
  constructor(message: string = "User signup failed") {
    super(message)
  }
}

export class SchemaValidationError extends CrashingError {}
export class ModelPayloadValidationError extends CustomError {}

export class MongoQueryError extends CrashingError {}

export class UnauthorizedRuleAccessError extends CustomError {}