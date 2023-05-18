import { Context } from 'apollo-server-core'
import { Request, Response } from 'express'

interface Session {
  userId: string
}

export interface MyContext extends Context {
  req: Request & { session: Session }
  res: Response
  userId: number
}
