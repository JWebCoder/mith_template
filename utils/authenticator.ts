import { debug, IRequest, IResponse, NextFunction } from '../deps.ts'

export interface IAuther {
  login: (req: IRequest, res: IResponse, next: NextFunction) => Promise<any>
}

type loadedStrategy = {
  enabled: boolean,
  strategy: any
}

export class Authenticator {
  private strategies: {
    [name: string]: loadedStrategy
  } = {}

  /**
   * Adds a new strategy to the current Authenticator instance
   * @param name contains the strategy name that will target the strategy
   * @param strategy strategy to use
   */
  use(name: string, strategy: any) {
    if (this.strategies[name]) {
      throw new Error(`Strategy ${name} already loaded`)
    }
    this.strategies[name] = {
      enabled: true,
      strategy
    }
  }

  /**
   * Enables an already loaded strategy
   * @param name contains the strategy name
   */
  enable(name: string) {
    if (!this.strategies[name]) {
      throw new Error(`Strategy ${name} not loaded`)
    }
    this.strategies[name].enabled = true
  }

  /**
   * Disables an already loaded strategy
   * @param name contains the strategy name
   */
  disable(name: string) {
    if (!this.strategies[name]) {
      throw new Error(`Strategy ${name} not loaded`)
    }
    this.strategies[name].enabled = false
  }

  /**
   * Runs the correspondent strategy agains a user request
   * @param name contains the strategy name to be targeted
   * @return Middleware for the Mith framework
   */
  login(name: string) {
    return async (req: IRequest, res: IResponse, next: NextFunction) => {
      if (!this.strategies[name]) {
        next(new Error(`Strategy ${name} not loaded`))
      }
      this.strategies[name].strategy.login(req, res, next).then(
        (user: any) => {
          if (!req.session) {
            req.session = {}
          }

          req.session.user = user
          next()
        }
      ).catch(
        (error: any) => {
          next(error)
        }
      )
    }
  }

  /**
   * Calls the next item in the stack if the user is authenticated or throws an error
   * @param req Mith framework request interface
   * @param res Mith framework response interface
   * @param next Mith framework next function
   */
  isAuth(req: IRequest, res: IResponse, next: NextFunction) {
    if (req.session?.user) {
      return next()
    }
    next(new Error('User not authenticated'))
  }

  static serialize(user: any) {
    return user
  }

  static deserialize(user: any) {
    return user
  }
}