# Fall of the Men's Days API
`Fall of the Men's Days` (or FotMD for short) is a homebrew RPG System of a dystopian Steam/Desert punk apocalyptic world, where humans don't exist anymore due to catastrophic climatic changes. The players are advanced artificial inteligence beings.

This project was born with the goal to create an API to handle the requests made by an Android APP and a Web System, which will incorporate the game assets to play remotely.

## Roadmap
#### User
* POST /user/auth
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
