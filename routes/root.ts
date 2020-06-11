import { Router } from '../deps.ts'
import userController from '../controllers/users.ts'

const rootRouter = new Router()

rootRouter.use(
  'GET',
  '/user/:id',
  (req, res) => {
    res.body = userController.getUserById(req.params.id)
  }
)

rootRouter.use(
  'GET',
  '/users',
  (req, res) => {
    res.body = userController.getUsers()
  }
)

rootRouter.use(
  'GET',
  '/',
  (req, res) => {
    res.body = 'Hello Mith'
  }
)

export { rootRouter }