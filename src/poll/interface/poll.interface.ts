import { RivalInterface } from "./rival.interface";

export class PollInterface {
    pk?: number
    pollName: string
    votersNumber?: number
    rivals: RivalInterface[]
    pollPk: number
}