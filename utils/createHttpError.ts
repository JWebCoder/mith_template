import { Status, STATUS_TEXT } from '../deps.ts'

type ErrorStatus =
  | Status.BadRequest
  | Status.Unauthorized
  | Status.PaymentRequired
  | Status.Forbidden
  | Status.NotFound
  | Status.MethodNotAllowed
  | Status.NotAcceptable
  | Status.ProxyAuthRequired
  | Status.RequestTimeout
  | Status.Conflict
  | Status.Gone
  | Status.LengthRequired
  | Status.PreconditionFailed
  | Status.RequestEntityTooLarge
  | Status.RequestURITooLong
  | Status.UnsupportedMediaType
  | Status.RequestedRangeNotSatisfiable
  | Status.ExpectationFailed
  | Status.Teapot
  | Status.MisdirectedRequest
  | Status.UnprocessableEntity
  | Status.Locked
  | Status.FailedDependency
  | Status.UpgradeRequired
  | Status.PreconditionRequired
  | Status.TooManyRequests
  | Status.RequestHeaderFieldsTooLarge
  | Status.UnavailableForLegalReasons
  | Status.InternalServerError
  | Status.NotImplemented
  | Status.BadGateway
  | Status.ServiceUnavailable
  | Status.GatewayTimeout
  | Status.HTTPVersionNotSupported
  | Status.VariantAlsoNegotiates
  | Status.InsufficientStorage
  | Status.LoopDetected
  | Status.NotExtended
  | Status.NetworkAuthenticationRequired

/** A base class for individual classes of HTTP errors. */
export class HttpError extends Error {
  /** Determines if details about the error should be automatically exposed
   * in a response.  This is automatically set to `true` for 4XX errors, as
   * they represent errors in the request, while 5XX errors are set to `false`
   * as they are internal server errors and exposing details could leak
   * important server security information. */
  expose = false

  /** The HTTP error status associated with this class of error. */
  status = Status.InternalServerError
}

function createHttpErrorConstructor<E extends typeof HttpError>(
  status: ErrorStatus,
): E {
  const name = `${Status[status]}Error`
  const Ctor = class extends HttpError {
    constructor(message?: string) {
      super()
      this.message = message || STATUS_TEXT.get(status)!
      this.status = status
      this.expose = status >= 400 && status < 500 ? true : false
      this.name = name
    }
  }
  return Ctor as E
}

/** An object which contains an individual HTTP Error for each HTTP status
 * error code (4XX and 5XX).  When errors are raised related to a particular
 * HTTP status code, they will be of the appropriate instance located on this
 * object.  Also, context's `.throw()` will throw errors based on the passed
 * status code. */
export const httpErrors: Record<keyof typeof Status, typeof HttpError> =
  {} as any

for (const [key, value] of Object.entries(Status)) {
  httpErrors[key as keyof typeof Status] = createHttpErrorConstructor(
    value as ErrorStatus,
  )
}

/** Create a specific class of `HttpError` based on the status, which defaults
 * to _500 Internal Server Error_.
 */
export function createHttpError(
  status: ErrorStatus = 500,
  message?: string,
): HttpError {
  return new httpErrors[Status[status] as keyof typeof Status](message)
}

export function isHttpError(value: any): value is HttpError {
  return value instanceof HttpError
}