import { Rival } from "./rival.interface";

export class Poll {
    pk?: number
    rivalName: string
    votersNumber?: number
    rivals: Rival[]
    pollPk: number
}