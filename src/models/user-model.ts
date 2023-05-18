import { InputType, Field } from 'type-graphql'
import { Length, IsEmail, Matches } from 'class-validator'

@InputType()
export class Users {
  @Field(() => String)
  @Length(2, 20, { message: 'User name must be between 2 and 20 characters.' })
  userName!: string

  @Field(() => String)
  @Length(2, 20, { message: 'First name must be between 2 and 20 characters.' })
  firstName!: string

  @Field(() => String)
  @Length(2, 20, { message: 'Last name must be between 2 and 20 characters.' })
  lastName!: string

  @Field(() => String)
  @IsEmail()
  @Length(5, 50, { message: 'Email must be between 5 and 50 characters.' })
  email!: string

  @Field(() => String)
  @Length(8, 20, { message: 'Password must be between 5 and 50 characters.' })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/, {
    message:
      'Password too weak. Must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
  })
  password!: string
}
