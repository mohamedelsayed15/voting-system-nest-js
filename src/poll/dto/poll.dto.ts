import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, MaxLength, MinLength, ValidateNested } from "class-validator";
import { RivalDto } from "./rival.dto";

export class PollDto {
    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(4)
    @Type(() => RivalDto)
    rivals: RivalDto[]
    @MinLength(1)
    @MaxLength(30)
    pollName: string
}