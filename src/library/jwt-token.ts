import jwt from 'jsonwebtoken'

export function sign(payload: object, secret: string, options?: jwt.SignOptions): string {
  return jwt.sign(payload, secret, options)
}
