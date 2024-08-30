import { IsString, Matches, MaxLength, MinLength } from "class-validator"

export class VoterDto {
    @MinLength(1)
    @MaxLength(30)
    firstName: string
    @MinLength(1)
    @MaxLength(30)
    secondName: string
    @MinLength(1)
    @MaxLength(30)
    nationalId: string
    @IsString()
    @MinLength(8, {
        message: 'Password must be at least 8 characters long',
    })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must contain at least one letter, one number, and one special character',
    })
    password: string
}