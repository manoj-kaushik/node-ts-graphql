import { ObjectType, Field } from 'type-graphql'
import { ReviewOutput } from '../models/review-output-model'

@ObjectType()
export class PaginatedReview {
  @Field(() => [ReviewOutput])
  reviews!: ReviewOutput[]

  @Field()
  totalCount!: number

  @Field()
  hasMore!: boolean
}
