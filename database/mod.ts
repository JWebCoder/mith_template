import { MongoClient } from '../deps.ts'
import { setupUsers } from './users.ts'
import { debug } from '../deps.ts'
import { env } from '../utils/envLoader.ts'

const logger = debug(`${env.PROJECT_NAME}:database`)

logger('Connecting to database %s', env.MONGO_DATABASE)

const client = new MongoClient()
client.connectWithOptions({
  hosts: [env.MONGO_HOST],
  username: env.MONGO_USERNAME,
  password: env.MONGO_PASSWORD,
})
const database = client.database(env.MONGO_DATABASE)
const UserModel = setupUsers()

export {
  database,
  UserModel
}
