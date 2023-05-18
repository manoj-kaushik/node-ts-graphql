import { InputType, Field, Int } from 'type-graphql'

@InputType()
export class UpdateMovies {
  @Field(() => Int)
  id!: number

  @Field(() => String, { nullable: true })
  movieName?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  directorName?: string | null

  @Field(() => String, { nullable: true })
  releaseDate?: Date
}
