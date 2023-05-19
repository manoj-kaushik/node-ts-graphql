/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { compare, hash } from 'bcrypt'
import { sign } from '../library/jwt-token'
import { Users } from '../models/user-model'
import { PrismaClient } from '@prisma/client'
import { ApolloError, UserInputError } from 'apollo-server'

const prisma = new PrismaClient()
const saltRounds = 10 // the number of salt rounds to use for bcrypt hashing

/**
 * register user
 * @param data Users
 * @returns boolean
 */
export async function registerUserService(data: Users): Promise<boolean> {
  try {
    const { userName, firstName, lastName, email, password } = data
    // Check if a user with the same email already exists
    const existingUser = await prisma.users.findFirst({ where: { email } })
    if (existingUser) throw new UserInputError('Email already in use')

    const hasedPassword = await hash(password, saltRounds)

    const result = await prisma.users.create({
      data: {
        userName: userName.trim(),
        email,
        password: hasedPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        isActive: true
      }
    })
    return result !== null
  } catch (ex: any) {
    throw new ApolloError(ex.message)
  }
}

/**
 * login user
 * @param email string
 * @param password string
 * @returns string
 */
export async function loginUserService(email: string, password: string): Promise<string> {
  try {
    const user = await prisma.users.findFirst({ where: { email } })
    if (!user) throw new UserInputError('User not found.')
    if (!(await compare(password, user.password!))) throw new UserInputError('Invalid password.')
    return sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN })
  } catch (ex: any) {
    throw new ApolloError(ex.message)
  }
}

/**
 * change password
 * @param oldPassword string
 * @param newPassword string
 * @param userId number
 * @returns boolean
 */
export async function changePasswordService(
  oldPassword: string,
  newPassword: string,
  userId: number
): Promise<boolean> {
  try {
    const user = await prisma.users.findFirst({ where: { id: userId } })
    if (!user) throw new UserInputError('User not found.')
    if (!(await compare(oldPassword, user.password))) throw new UserInputError('Old password is Invalid.')
    if (oldPassword === newPassword) throw new UserInputError('New password cannot be the same as the old password.')

    const hashPassword = await hash(newPassword, saltRounds)
    const result = await prisma.users.update({ where: { id: userId }, data: { password: hashPassword } })
    return result !== null
  } catch (ex: any) {
    throw new ApolloError(ex.message)
  }
}
