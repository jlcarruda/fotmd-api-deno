# Fall of the Men's Days API
`Fall of the Men's Days` (or FotMD for short) is a homebrew RPG System of a dystopian Steam/Desert punk apocalyptic world, where humans don't exist anymore due to catastrophic climatic changes. The players are advanced artificial inteligence beings.

This project was born with the goal to create an API to handle the requests made by an Android APP and a Web System, which will incorporate the game assets to play remotely.

## Roadmap
#### Features
* Database Connection setup function <u>*(DONE)*</u>
* Decorators <u>*(1/2)*</u>
  * Authentication Decorator for rules access <u>*(DONE)*</u>
  * Authorization Decorator, for features who need only specific roles and users to access
* Payload validation for sanitizing and validate user input
* Implement User roles
* Custom Types enum
* Custom errors lib
* Models<u>*(0/3)*</u>
  * User Model
  * Character Model
  * Table Model
* 'Mongoose' Like Schema validator for models <u>*(1/3)*</u>
  * schemaToObject <u>*(DONE. Implemented into the Model class. Later will be isolated)*</u>
  * validate schema on saving
  * populate

## Routes
#### User
* POST /user/auth <u>*(DONE)*</u>
* POST /user/signup <u>*(DONE)*</u>
* POST /user/logout
* GET /user/profile
* GET /user/character
* GET /user/character/:id
* GET /user/tables/owned
* GET /user/tables/joined

#### Dungeon Master
* POST /dm/auth
* POST /dm/logout
* GET /dm/table
* GET /dm/table/:id

#### Web Socket connections
* /table/join/:id
* /table/leave/:id
* /table/:id/character
* /table/:id/info
