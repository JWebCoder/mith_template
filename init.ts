import './preChecks.ts'
import { env } from './utils/envLoader.ts'
import { App } from './server.ts'
import { debug } from './deps.ts'

const logger = debug(`${env.PROJECT_NAME}:init`)

const PORT = Number(env.PORT) || 8000

const app = new App()
app.init()
app.listen({ port: PORT})
logger('listening on %s', PORT)