import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { RivalDto } from "./rival.dto";

export class RivalsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RivalDto)
    rivals: RivalDto[]
}