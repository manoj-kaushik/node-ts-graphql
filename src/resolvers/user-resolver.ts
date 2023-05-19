import { Resolver, Mutation, Arg, Ctx, Authorized } from 'type-graphql'
import { MyContext } from '../library/MyContext'
import { Users } from '../models/user-model'
import { registerUserService, loginUserService, changePasswordService } from '../services/user-service'
import { validate } from 'class-validator'
import { validateInput } from '../library/validator'

@Resolver()
export class UserResolver {
  /**
   * register user
   * @param data Users
   * @returns boolean
   */
  @Mutation(() => Boolean)
  async registerUser(@Arg('data') data: Users): Promise<boolean> {
    const errors = await validate(data) // Validate the input data using class-validator
    if (errors.length > 0) validateInput(errors)
    return registerUserService(data)
  }

  /**
   * login user
   * @param email string
   * @param password string
   * @param res any 
   * @returns boolean
   */
  @Mutation(() => String)
  async loginUser(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ): Promise<boolean> {
    const token = await loginUserService(email, password)
    res.setHeader('Authorization', `Bearer ${token}`)
    return true
  }

  /**
   * change password
   * @param oldPassword string
   * @param newPassword string
   * @param userId number
   * @returns boolean
   */
  @Authorized()
  @Mutation(() => Boolean)
  async changePassword(
    @Arg('oldPassword') oldPassword: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { userId }: MyContext
  ): Promise<boolean> {
    return changePasswordService(oldPassword, newPassword, userId)
  }
}
