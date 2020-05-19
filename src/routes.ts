import { Router } from 'https://deno.land/x/oak/mod.ts'

import UserRules from './rules/User.ts'

export default function createRouter (): Router {
  const router = new Router();
  router
    .post('/user/auth', ctx => UserRules.userAuth(ctx))
    .get('/user/profile', ctx => UserRules.getProfile(ctx))
    .get('/user/characters', ctx => UserRules.getCharacters(ctx))

  return router
}