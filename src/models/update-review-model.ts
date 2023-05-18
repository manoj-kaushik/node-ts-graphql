import { Field, InputType, Int } from 'type-graphql'

@InputType()
export class UpdateReviews {
  @Field(() => Int)
  id!: number

  @Field(() => Number, { nullable: true })
  rating!: number

  @Field(() => String, { nullable: true })
  comment!: string
}
