import { Poll } from "src/entities/poll.entity"

export class RivalInterface {
    pk?: number
    rivalName: string
    votersNumber?: number
    pollPk?: Poll
}