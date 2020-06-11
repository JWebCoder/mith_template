import { debug, Request, Response, NextFunction } from './deps.ts'

const logger = debug('template:api-logger')

export const apiLogger = async (req: Request, res: Response, next: NextFunction) => {
  logger('Request - %s - %s', req.serverRequest.url, req.serverRequest.method)
  const body = await req.body()
  if (body) {
    logger('Request body - %o', body)
  }
  logger('Response - %s - %o', res.status, res.body)
}