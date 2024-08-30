import { IsIn, MaxLength, MinLength } from "class-validator"

export class LoginDto {
    @MinLength(1)
    @MaxLength(30)
    loginText: string
    @MinLength(8)
    password: string
    @IsIn(['admin', 'voter'], {
        message: 'Role must be either "admin" or "voter"',
    })
    role: "admin" | "voter";
}