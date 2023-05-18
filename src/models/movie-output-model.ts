import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class MovieOutput {
  @Field(() => String)
  movieName!: string

  @Field(() => Number)
  userId!: number

  @Field(() => String)
  description!: string

  @Field(() => String)
  directorName!: string

  @Field(() => String)
  releaseDate!: Date
}
