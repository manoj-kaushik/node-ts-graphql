import dotenv from 'dotenv'
dotenv.config()

import 'reflect-metadata'
import express from 'express'
import { buildSchema } from 'type-graphql'
import { PrismaClient } from '@prisma/client'
import authChecker from './library/auth-checker'
import { ApolloServer } from 'apollo-server-express'
import { UserResolver } from './resolvers/user-resolver'
import { MovieResolver } from './resolvers/movie-resolver'
import { ReviewResolver } from './resolvers/review-resolver'

const prisma = new PrismaClient()

const app = express()

// This is going to be our default local port for our backend. Feel free to change it.
const PORT = process.env.PORT || 8090

async function runServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver, MovieResolver, ReviewResolver],
    emitSchemaFile: true,
    validate: false,
    authChecker: authChecker // provide your authChecker function here
  })

  const server = new ApolloServer({
    schema,
    formatError: (err) => {
      // TODO: we can log the error in the cloudwatch or any other logger
      console.error(err)
      // only return the error message
      return { message: err.message }
    },
    context: ({ req, res }) => ({
      prisma,
      req,
      res
    })
  })
  await server.start()
  server.applyMiddleware({ app })
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  })
}

runServer()
