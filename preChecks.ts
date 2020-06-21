import 'https://deno.land/x/dotenv@v0.4.3/load.ts'
import { missingEnv } from './utils/envLoader.ts'

const missing = missingEnv([
  'PROJECT_NAME',
  'MONGO_HOST',
  'MONGO_USERNAME',
  'MONGO_PASSWORD',
  'MONGO_DATABASE',
])

if (missing.length) {
  throw `Missing environemnt variables: ${missing.join(', ')}`
}