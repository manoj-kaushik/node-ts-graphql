/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resolver, Query, Int, Arg, Mutation, Ctx, Authorized } from 'type-graphql'
import { MyContext } from '../library/MyContext'
import { Movies } from '../models/movie-model'
import { UpdateMovies } from '../models/update-movie-model'
import { MovieOutput } from '../models/movie-output-model'
import {
  getMoviesService,
  movieDetailService,
  deleteMovieService,
  createMovieService,
  updateMovieService
} from '../services/movie-service'
import { PaginatedMovies } from '../library/paginatedMovie'
import { validate } from 'class-validator'
import { validateInput } from '../library/validator'

@Resolver()
export class MovieResolver {
  /**
   * create movie
   * @param data Movies
   * @param userId number
   * @returns boolean
   */
  @Authorized()
  @Mutation(() => Boolean)
  async createMovie(@Arg('data') data: Movies, @Ctx() { userId }: MyContext): Promise<boolean> {
    const errors = await validate(data) // Validate the input data using class-validator
    if (errors.length > 0) validateInput(errors)
    return createMovieService(data, userId)
  }

  /**
   * update movie
   * @param userId number
   * @param data UpdateMovies
   * @returns boolean
   */
  @Authorized()
  @Mutation(() => Boolean)
  async updateMovie(@Ctx() { userId }: MyContext, @Arg('data') data: UpdateMovies): Promise<boolean> {
    const errors = await validate(data) // Validate the input data using class-validator
    if (errors.length > 0) validateInput(errors)
    return updateMovieService(data, userId)
  }

  /**
   * get movie list
   * @param page number
   * @param size number
   * @param sortBy string
   * @param sortOrder string
   * @param searchTerm string
   * @returns array
   */
  @Authorized()
  @Query(() => PaginatedMovies)
  async getMovies(
    @Arg('page', () => Int, { defaultValue: 1 }) page: number,
    @Arg('size', () => Int, { defaultValue: 10 }) size: number,
    @Arg('sortBy', () => String, { defaultValue: 'movieName' }) sortBy: string,
    @Arg('sortOrder', () => String, { defaultValue: 'asc' }) sortOrder: 'asc' | 'desc',
    @Arg('searchTerm', { nullable: true }) searchTerm?: string
  ): Promise<PaginatedMovies> {
    return getMoviesService(sortBy, sortOrder, size, page, searchTerm)
  }

  /**
   * movie detail
   * @param id number
   * @returns object
   */
  @Authorized()
  @Query(() => MovieOutput)
  async movie(@Arg('id', () => Int) id: number): Promise<MovieOutput> {
    return movieDetailService(id)
  }

  /**
   * delete movie
   * @param id number
   * @param userId number
   * @returns boolean
   */
  @Authorized()
  @Mutation(() => Boolean)
  async deleteMovie(@Arg('id', () => Int) id: number, @Ctx() { userId }: MyContext): Promise<boolean> {
    return deleteMovieService(userId, id)
  }
}
