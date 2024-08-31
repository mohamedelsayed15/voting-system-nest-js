import { IsInt, IsString, MaxLength, Min, MinLength } from "class-validator"

export class VoteToDto {

    @IsInt()
    @Min(1)
    pollPk: number


    @IsString()
    @MinLength(1)
    @MaxLength(30)
    pollName: string

    @IsInt()
    @Min(1)
    rivalPk: number


    @IsString()
    @MinLength(1)
    @MaxLength(30)
    rivalName: string
}