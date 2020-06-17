import { debug, IRequest, IResponse, NextFunction } from '../deps.ts'
import { IAuther, Authenticator } from  './authenticator.ts'

type verifier = (username: string, password: string) => Promise<any>
type config = {
  usernameField?: string
  passwordField?: string
}

export class LocalAuth implements IAuther {
  verifier: verifier
  usernameField: string
  passwordField: string
  constructor(verifier: verifier, config?: config) {
    this.verifier = verifier
    this.usernameField = config?.usernameField ?? 'username'
    this.passwordField = config?.passwordField ?? 'password'
  }

  async login(req: IRequest, res: IResponse, next: NextFunction) {
    const body = await req.body()
    if (typeof body !== 'object') {
      return next(new Error('Wrong body format'))
    }
    const username = body[this.usernameField]
    const password = body[this.passwordField]

    if (typeof username !== 'string' || typeof password !== 'string') {
      return next(new Error('Wrong body format'))
    }
    return this.verifier(username, password).then(
      (user: any) => {
        if (!req.session) {
          req.session = {}
        }
        res.user = user
        req.session.user = Authenticator.serialize(user)
        next()
      }
    )
  }
}