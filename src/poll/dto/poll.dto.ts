import { Type } from "class-transformer";
import { IsArray, MaxLength, MinLength, ValidateNested } from "class-validator";
import { RivalDto } from "./rival.dto";

export class PollDto {
    @IsArray()
    @Type(() => RivalDto)
    rivals: RivalDto[]
    @MinLength(1)
    @MaxLength(30)
    pollName: string
}