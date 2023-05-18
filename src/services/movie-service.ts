/* eslint-disable @typescript-eslint/no-explicit-any */
import { validate } from 'class-validator'
import { PrismaClient } from '@prisma/client'
import { Movies } from '../models/movie-model'
import { validateInput } from '../library/validator'
import { ApolloError, UserInputError } from 'apollo-server'
import { PaginatedMovies } from '../library/paginatedMovie'
import { UpdateMovies } from '../models/update-movie-model'
import { MovieOutput } from '../models/movie-output-model'

const prisma = new PrismaClient()

export async function getMoviesService(
  sortBy: string,
  sortOrder: string,
  size: number,
  page: number,
  searchTerm: string | undefined
): Promise<PaginatedMovies> {
  try {
    const movies = await prisma.movies.findMany({
      where: {
        OR: [
          { movieName: { contains: searchTerm || '', mode: 'insensitive' } },
          { description: { contains: searchTerm || '', mode: 'insensitive' } }
        ]
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * size,
      take: size
    })
    const totalCount = await prisma.movies.count({
      where: {
        OR: [{ movieName: { contains: searchTerm || '' } }, { description: { contains: searchTerm || '' } }]
      }
    })
    return {
      movies,
      totalCount,
      hasMore: page * size < totalCount
    }
  } catch (ex: any) {
    throw new ApolloError(ex.message)
  }
}

export async function movieDetailService(id: number): Promise<MovieOutput> {
  try {
    const movie = await prisma.movies.findFirst({ where: { id } })
    if (!movie) throw new UserInputError('Invalid Movie Id.')

    return movie
  } catch (ex: any) {
    throw new ApolloError(ex.message)
  }
}

export async function deleteMovieService(userId: number, id: number): Promise<boolean> {
  try {
    const movie = await prisma.movies.findFirst({ where: { id, userId } })
    if (!movie) throw new UserInputError('You dont have permissions to delete this movie.')

    // delete the reviews first
    await prisma.reviews.deleteMany({ where: { movieId: id } })
    const result = await prisma.movies.delete({ where: { id } })
    return result !== null
  } catch (ex: any) {
    throw new ApolloError(ex.message)
  }
}

export async function createMovieService(data: Movies, userId: number): Promise<boolean> {
  try {
    const movie = await prisma.movies.create({
      data: {
        userId,
        movieName: data.movieName.trim(),
        description: data.description.trim(),
        directorName: data.directorName.trim(),
        releaseDate: new Date(data.releaseDate)
      }
    })

    const errors = await validate(movie)
    if (errors.length > 0) validateInput(errors)
    return true
  } catch (ex: any) {
    throw new ApolloError(ex.message)
  }
}

export async function updateMovieService(data: UpdateMovies, userId: number): Promise<boolean> {
  try {
    const movie = await prisma.movies.findFirst({ where: { id: data.id, userId } })
    if (!movie) throw new UserInputError('You dont have permissions to update this movie.')

    const updateObject: any = {}
    if (data.movieName) updateObject.movieName = data.movieName.trim()
    if (data.description) updateObject.description = data.description.trim()
    if (data.directorName) updateObject.directorName = data.directorName.trim()
    if (data.releaseDate) updateObject.releaseDate = new Date(data.releaseDate)

    await prisma.movies.update({ where: { id: movie.id }, data: updateObject })

    return true
  } catch (ex: any) {
    throw new ApolloError(ex.message)
  }
}
