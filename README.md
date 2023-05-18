# Movie Review

The API is designed and deployed in format of resolvers query and mutation functions.

## Tech Stack

1. [NodeJS](https://nodejs.org/en/)
2. [PostgreSQL](https://www.postgresql.org/)
3. [Typescript](https://www.typescriptlang.org/)
4. [Apollo Graphql](https://www.apollographql.com/)

## Recommended IDE

[Vscode](https://code.visualstudio.com/)

## Structure and Services

The project consists of a top level `package.json` typical of a nodejs project. However the individual resolvers code is in repective `src/resolvers/*` directories.

### Root Structure:

The root project contains shared modules, library and models, with individual directories for each API.

```
--project-root
    |_ .gitignore           // global git ignores
    |_ src                  // contains the resolvers, models
    |_ README.md            // this file
    |_ package.json         // package file. Node modules are global for all services
    |_ lib                  // shared code library items. Reusable with all services ////////
```

### src Structure:

```
--src
    |_ models               // The schema of the project
    |_ resolvers            // The query and mutation of the project
    |_ library              // this is responsible for library
    |_ services             // this is responsible for service layer to communicate with models
    |_ postgre-config.ts    // this is responsible for DB connection
    |_ index.ts             // main file of the project
```

## Building API service

The following steps are required for setup:

1. Install `nodejs`.
2. Install and run `postgre`.
3. Clone this git repository and go to root directory.
4. Install model modules: `npm install`
5. Create the .env file (can copy the .env.example)
6. Create the Database, which is given in the .env file (ex: movie_review)
7. Run the command `npm run migrate`
8. Run the command `npm run dev`
NOTE: Token is set in the response of the login API(as a security concern). You will get the token in the response header.

## Running the API

run the command `npm run dev`

## Endpoints of the project
BASE_URL=`http://localhost:8090/graphql`

Open the BASE_URL in the browser

## Sample Query and mutation
Login
NOTE: 
1. Token is set in the response of the login API(as a security concern). You will get the token in the response header.
2. Pass the Authorization token in the header in the private API's
```
mutation {
  loginUser(email: "daffodil@gmail.com", password: "NAsa@*7860")
}
```

Register
```
mutation {
  registerUser(data: {
      email: "daffodil@gmail.com",
      password: "NAsa@*7860",
      userName: "First",
      firstName: "John",
      lastName: "Doeabc"
    
  })
}
```

Change password
```
mutation {
  changePassword(oldPassword: "NAsa@*7860", newPassword: "NAsa@*7861")
}
```

Create Movie
```
mutation {
  createMovie(data: {
      movieName: "Scorsese",
      description: "characters, dark worlds, and meditations",
      directorName: "Steven Spielberg",
      releaseDate: "2021-09-01"
  })
}
```

Update Movie
```
mutation {
  updateMovie(data: {
    	id: 1,
        movieName: "Steven Spielberg1 123",
        description: "New Movie Description",
        releaseDate: "2022-10-12"
  })
}
```

Delete Movie
```
mutation {
  deleteMovie(id: 7)
}
```

Get Movie List
```
query {
  getMovies(page: 1, size: 10, sortBy: "movieName", sortOrder: "asc", searchTerm: "sco") {
    movies {
        description
        movieName
        description
        directorName
        releaseDate
    }
    totalCount
    hasMore
  }
}
```

Create Review
```
mutation {
  createReview(data: {
      movieId: 2,
      rating: 5,
      comment: "sdasdasdasd"
  })
}
```

Delete Review
```
mutation {
  deleteReview(id: 10)
}
```

Update Review
```
mutation {
  updateReview(data: {
      id: 2,
      rating: 3,
      comment: "True comm"
  })
}
```

Get Reviews By Movie Id
```
query {
  reviewsByMovieId(page: 1, size: 10, movieId: 2) {
      reviews {
          id
          comment
          rating
      }
    totalCount
    hasMore
  }
}
```
