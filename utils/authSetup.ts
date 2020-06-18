import { Authenticator } from './authenticator.ts'
import { LocalAuth } from './localAuth.ts'
import { makeJwt, validateJwt, convertBase64ToString, convertBase64urlToBase64, v4 } from '../deps.ts'

const JWTKey = v4.generate()

Authenticator.serialize = (user: any) => {
  return makeJwt({
    header: {
      alg: "HS256",
      typ: "JWT",
    },
    payload: {
      username: user.username
    },
    key: JWTKey
  })
}

Authenticator.deserialize = async (jwt: string) => {
  return await validateJwt(jwt, JWTKey, { isThrowing: false })
    ? JSON.parse(convertBase64ToString(convertBase64urlToBase64(jwt.split('.')[1])))
    : null
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