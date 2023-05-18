import { ObjectType, Field } from 'type-graphql'
import { MovieOutput } from '../models/movie-output-model'

@ObjectType()
export class PaginatedMovies {
  @Field(() => [MovieOutput])
  movies!: MovieOutput[]

  @Field()
  totalCount!: number

  @Field()
  hasMore!: boolean
}
