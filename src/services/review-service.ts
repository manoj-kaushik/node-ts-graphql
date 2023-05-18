/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError, UserInputError } from 'apollo-server'
import { validate } from 'class-validator'
import { validateInput } from '../library/validator'
import { PaginatedReview } from '../library/paginatedReview'
import { PrismaClient } from '@prisma/client'
import { Reviews } from '../models/review-model'
import { UpdateReviews } from '../models/update-review-model'
import { ReviewOutput } from '../models/review-output-model'
const prisma = new PrismaClient()

export async function createReviewService(data: Reviews, userId: number): Promise<boolean> {
  try {
    // check movieId is correct
    const movie = await prisma.movies.findFirst({ where: { id: data.movieId } })
    if (!movie) throw new UserInputError('Invalid Movie Id.')

    // Create a new review
    const review = await prisma.reviews.create({
      data: {
        movieId: data.movieId,
        userId,
        rating: data.rating,
        comment: data.comment.trim()
      }
    })
    const errors = await validate(review)
    if (errors.length > 0) validateInput(errors)
    return true
  } catch (ex: any) {
    throw new ApolloError(ex.message)
  }
}

export async function deleteReviewService(userId: number, id: number): Promise<boolean> {
  try {
    const review = await prisma.reviews.findFirst({ where: { id, userId } })
    if (!review) throw new UserInputError('Operation Not Allowed For This Review.')

    const result = await prisma.reviews.delete({ where: { id } })
    return result !== null
  } catch (ex: any) {
    throw new ApolloError(ex.message)
  }
}

export async function reviewsByMovieIdService(
  userId: number,
  movieId: number,
  page: number,
  size: number
): Promise<PaginatedReview> {
  try {
    const reviews: ReviewOutput[] =
      await prisma.$queryRaw`SELECT * FROM public."Reviews" WHERE "movieId" = ${movieId} ORDER BY CASE WHEN "userId" = ${userId} THEN 0 ELSE 1 END, "createdAt" DESC`

    const totalCount = await prisma.reviews.count({ where: { movieId } })
    return {
      reviews,
      totalCount: totalCount,
      hasMore: page * size < totalCount
    }
  } catch (ex: any) {
    throw new ApolloError(ex.message)
  }
}

export async function updateReviewService(data: UpdateReviews, userId: number): Promise<boolean> {
  try {
    const review = await prisma.reviews.findFirst({ where: { id: data.id, userId } })
    if (!review) throw new UserInputError('Operation Not Allowed For This Review.')

    const updateObject: any = {}
    if (data.rating) updateObject.rating = data.rating
    if (data.comment) updateObject.comment = data.comment.trim()

    await prisma.reviews.update({ where: { id: review.id }, data: updateObject })

    return true
  } catch (ex: any) {
    throw new ApolloError(ex.message)
  }
}
