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
import './database/mod.ts'
import { env } from './utils/envLoader.ts'

const logger = debug(`${env.PROJECT_NAME}:server`)

export class App extends Mith {
  init() {
    this.setupBeforeStack()
    this.setupMainStack()
    this.setupAfterStack()
    this.setupErrorStack()
  }

  /**
   * Setup the "before" stack
   * - cors
   * - session module
   */
  setupBeforeStack(){
    logger('Setting before stack')
    this.before(mithCors()); // Enable CORS for All Routes
    this.before(cookieSession({
      secret:'stuff',
    }))
  }
  
  /**
   * Setup the "main" stack
   * - static file server
   * - main router
   * - request not handled middleware
   */
  setupMainStack(){
    logger('Setting main stack')
    this.use(serveStatic(resolve(Deno.cwd(), 'static'), '/static', {
      maxage: 120,
    }))
    this.use(rootRouter.getRoutes())
    this.use((req, res, next) => {
      if (!req.requestHandled) {
        return next(new httpErrors.NotFound('not found'))
      }
      next()
    })
  }

  /**
   * Setup the "after" stack
   * - logger for all the api request
   */
  setupAfterStack(){
    logger('Setting after stack')
    this.after(apiLogger(
      [
        '/login'
      ],
      [
        '/me'
      ]
    ))
  }

  /**
   * Setup the "error" stack
   * - error handler middleware
   */
  setupErrorStack(){
    logger('Setting error stack')
    this.error(
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
            res.body = env.ENV === 'production'
            ? 'error'
            : error.message
          }
        }
        
        next()
      }
    )
  }
}
