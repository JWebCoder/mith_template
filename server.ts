import {
  debug,
  Mith,
  serveStatic,
  resolve,
  mithCors,
  cookieSession
} from './deps.ts'
import { rootRouter } from './routes/root.ts'
import { apiLogger } from './utils/apiLogger.ts'
import { httpErrors, HttpError } from './utils/createHttpError.ts'

const { env } = Deno
const logger = debug(`${env.get('PROJECT_NAME')}:server`)
/**
 * Initialise the Mith framework
 */
const app = new Mith()

/**
 * Setup the "before" stack
 * - cors
 * - session module
 */
logger('Setting before stack')
app.before(mithCors()); // Enable CORS for All Routes
app.before(cookieSession({
  secret:'stuff',
}))

/**
 * Setup the "main" stack
 * - static file server
 * - main router
 * - request not handled middleware
 */
logger('Setting main stack')
app.use(serveStatic(resolve(Deno.cwd(), 'static'), '/static', {
  maxage: 120,
}))
app.use(rootRouter.getRoutes())
app.use((req, res, next) => {
  if (!req.requestHandled) {
    return next(new httpErrors.NotFound('not found'))
  }
  next()
})

/**
 * Setup the "after" stack
 * - logger for all the api request
 */
logger('Setting after stack')
app.after(apiLogger(
  [
    '/login'
  ],
  [
    '/me'
  ]
))

/**
 * Setup the "error" stack
 * - error handler middleware
 */
logger('Setting error stack')
app.error(
  (req, res, next) => {
    const error = res.error
    if (error) {
      if (error instanceof HttpError) {
        res.status = error.status
        res.body = error.expose
          ? error.message
          : 'error'
      } else {
        res.status = error.status || 500
        res.body = env.get('ENV') === 'production'
        ? 'error'
        : error.message
      }
    }
    
    next()
  }
)

export default app