import { Router } from '../deps.ts'
import userController from '../controllers/users.ts'
import { authenticator } from '../utils/authSetup.ts'
import { Authenticator } from '../utils/authenticator.ts'
import { httpErrors } from '../utils/createHttpError.ts'
import { UserSchema } from '../database/users.ts'

const rootRouter = new Router()

rootRouter.use(
  'GET',
  '/user/:id',
  async (req, res, next) => {
    res.body = await userController.getById(req.params.id)
    next()
  }
)

rootRouter.use(
  'POST',
  '/user',
  async (req, res, next) => {
    const body = await req.body()
    if (!body || typeof body === 'string') {
      return next(new httpErrors.UnprocessableEntity('Missing required parameters'))
    }
    res.body = await userController.insert(body as Partial<UserSchema>)
    next()
  }
)

rootRouter.use(
  'DELETE',
  '/user/:id',
  async (req, res, next) => {
    if (!req.params.id) {
      return next(new httpErrors.UnprocessableEntity('Missing required parameters'))
    }
    res.body = (await userController.delete(parseInt(req.params.id, 10))).toString()
    next()

  }
)

rootRouter.use(
  'GET',
  '/users',
  async (req, res, next) => {
    res.body = await userController.getAll()
    next()
  }
)

rootRouter.use(
  'GET',
  '/login',
  [
    authenticator.login('local'),
    (req, res, next) => {
      res.body = 'welcome'
      next()
    }
  ]
)

rootRouter.use(
  'GET',
  '/me',
  [
    authenticator.isAuth,
    async (req, res, next) => {
      res.body = await Authenticator.deserialize(req.session.user)
      next()
    }
  ]
)

rootRouter.use(
  'GET',
  '/',
  (req, res, next) => {
    res.body = 'Hello Mith'
    console.log('test')
    next()
  }
)

export { rootRouter }