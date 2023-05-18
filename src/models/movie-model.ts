import { InputType, Field } from 'type-graphql'
import { Length, IsNotEmpty } from 'class-validator'

@InputType()
export class Movies {
  @Field(() => String)
  @Length(2, 20, { message: 'Movie Name must be between 2 and 20 characters.' })
  movieName!: string

  @Field(() => String)
  @Length(5, 200, { message: 'Description must be between 5 and 200 characters.' })
  description!: string

  @Field(() => String)
  @Length(5, 20, { message: 'Director Name must be between 5 and 20 characters.' })
  directorName!: string

  @Field(() => String)
  @IsNotEmpty()
  releaseDate!: Date
}
