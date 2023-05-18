import { Field, InputType } from 'type-graphql'
import { IsNotEmpty, Length, Max, Min } from 'class-validator'

@InputType()
export class Reviews {
  @Field(() => Number)
  @IsNotEmpty()
  movieId!: number

  @Field(() => Number)
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  rating!: number

  @Field(() => String)
  @IsNotEmpty()
  @Length(5, 200, { message: 'Comment must be between 5 and 200 characters.' })
  comment!: string
}
