import jwt from 'jsonwebtoken'

/**
 * sign with jwt
 * @param payload object
 * @param secret string
 * @param options Object
 * @returns string
 */
export function sign(payload: object, secret: string, options?: jwt.SignOptions): string {
  return jwt.sign(payload, secret, options)
}
