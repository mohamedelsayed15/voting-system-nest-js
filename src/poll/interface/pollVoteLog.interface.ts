import { Poll } from "src/entities/poll.entity"
import { PollRivals } from "src/entities/pollRivals.entity"
import { Voter } from "src/entities/voter.entity"

export class PollVoteLogInterface {

    rivalPk: number 
    rivalName: string

    voterPk: number 
    voterName: string

    pollPk: number 

    createdAt?: Date
}
