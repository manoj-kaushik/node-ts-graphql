import { MyContext } from '../library/MyContext'
import { Resolver, Arg, Mutation, Int, Query, Ctx, Authorized } from 'type-graphql'
import {
  createReviewService,
  deleteReviewService,
  reviewsByMovieIdService,
  updateReviewService
} from '../services/review-service'
import { PaginatedReview } from '../library/paginatedReview'
import { Reviews } from '../models/review-model'
import { validate } from 'class-validator'
import { validateInput } from '../library/validator'
import { UpdateReviews } from '../models/update-review-model'

@Resolver()
export class ReviewResolver {
  @Authorized()
  @Mutation(() => Boolean)
  async createReview(@Arg('data') data: Reviews, @Ctx() { userId }: MyContext): Promise<boolean> {
    const errors = await validate(data) // Validate the input data using class-validator
    if (errors.length > 0) validateInput(errors)
    return createReviewService(data, userId)
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteReview(@Arg('id', () => Int) id: number, @Ctx() { userId }: MyContext) {
    return deleteReviewService(userId, id)
  }

  @Query(() => String)
  async hello() {
    return 'world'
  }

  @Authorized()
  @Query(() => PaginatedReview)
  async reviewsByMovieId(
    @Ctx() { userId }: MyContext,
    @Arg('movieId', () => Int) movieId: number,
    @Arg('page', () => Int, { defaultValue: 1 }) page: number,
    @Arg('size', () => Int, { defaultValue: 10 }) size: number
  ): Promise<PaginatedReview> {
    return reviewsByMovieIdService(userId, movieId, page, size)
  }

  @Authorized()
  @Mutation(() => Boolean)
  async updateReview(@Ctx() { userId }: MyContext, @Arg('data') data: UpdateReviews): Promise<boolean> {
    const errors = await validate(data) // Validate the input data using class-validator
    if (errors.length > 0) validateInput(errors)
    return updateReviewService(data, userId)
  }
}
