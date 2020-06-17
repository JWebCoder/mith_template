import { Authenticator } from './authenticator.ts'
import { LocalAuth } from './localAuth.ts'

Authenticator.serialize = (user: any) => {
  return '1'
}

Authenticator.deserialize = (user: any) => {
  return user
}

const authenticator = new Authenticator()
authenticator.use('local', new LocalAuth(
  async (username, password) => {
    if (username === 'user' && password === 'pass') {
      return {
        username,
        password
      }
    }
    throw new Error('Not authorized')
  }
))

export { authenticator }