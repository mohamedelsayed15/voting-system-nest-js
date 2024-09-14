import { RivalInterface } from "./rival.interface";

export class PollInterface {
    pk?: number
    pollName: string
    pollTotalVoters: number
    pollTotalRivals: number
    rivals?: RivalInterface[]
}