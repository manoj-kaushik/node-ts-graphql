/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'
import { UserInputError } from 'apollo-server'

import { MyContext } from './MyContext'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const JWT_SECRET = process.env.JWT_SECRET!

/**
 * check user authentication
 * @param context MyContext
 * @returns boolean
 */
const authChecker: AuthChecker<MyContext> = async ({ context }) => {
  const authorization = context.req?.headers['authorization']
  if (!authorization) throw new Error('Not authenticated')

  const token = authorization.split(' ')[1]
  const { userId } = jwt.verify(token, JWT_SECRET) as { userId: number }
  context.userId = userId // store the userId in the context for later use
  const user = await prisma.users.findFirst({ where: { id: userId } })
  if (!user) throw new UserInputError('You must be logged in')

  return true
}

export default authChecker
