import { Router } from '../deps.ts'
import userController from '../controllers/users.ts'

const rootRouter = new Router()

rootRouter.use(
  'GET',
  '/user/:id',
  (req, res, next) => {
    res.body = userController.getUserById(req.params.id)
    next()
  }
)

rootRouter.use(
  'GET',
  '/users',
  (req, res, next) => {
    res.body = userController.getUsers()
    next()
  }
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