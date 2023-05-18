import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class ReviewOutput {
  @Field(() => Int)
  id!: number

  @Field(() => Number)
  movieId!: number

  @Field(() => Number)
  rating!: number

  @Field(() => String)
  comment!: string
}
