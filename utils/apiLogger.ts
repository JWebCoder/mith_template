import { debug, IRequest, IResponse, NextFunction } from '../deps.ts'
import { env } from './envLoader.ts'

export const apiLogger = (hiddenRequests: string[] = [], hiddenReponses: string[] = [],) => {
  const logger = debug(`${env.PROJECT_NAME}:api-logger`)
  return async (req: IRequest, res: IResponse, next: NextFunction) => {
    const isHiddenRequest = hiddenRequests.includes(req.serverRequest.url)
    const isHiddenResponse = hiddenReponses.includes(req.serverRequest.url)
    logger('---')
    logger('Request - %s - %s', req.serverRequest.url, req.serverRequest.method)
    const body = await req.body()
    body
      ? logger('Request body - %o', isHiddenRequest ? 'hidden' : body)
      : logger('Request body - empty')
    logger('Response - %s - %o', res.status, isHiddenResponse ? 'hidden' : res.body)
    logger('---')
    next()
  }
}