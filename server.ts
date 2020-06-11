import {
  debug,
  Mith,
  serveStatic,
  resolve,
  mithCors,
  Request,
  Response,
  NextFunction
} from './deps.ts'
import { rootRouter } from './routes/root.ts'
import { apiLogger } from './apiLogger.ts'

const { env } = Deno
const logger = debug('template:server')

const app = new Mith()

logger('Setting before stack')
app.before(mithCors()); // Enable CORS for All Routes

logger('Setting main stack')
app.use(serveStatic(resolve(Deno.cwd(), 'static'), '/static', {
  maxage: 120,
}))
app.use(rootRouter.getRoutes())
app.use((req, res, next) => {
  if (!req.requestHandled) {
    next({status: 404, message:'not found'})
  }
})

logger('Setting after stack')
app.after(apiLogger)

logger('Setting error stack')
app.error(
  (req, res, next) => {
    if (res.error) {
      res.status = res.error.status || 500
      res.body = res.error.message
    }
    next()
  }
)

export default app