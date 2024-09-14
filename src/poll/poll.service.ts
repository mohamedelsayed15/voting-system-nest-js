import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { pollQueries } from './poll.query';
import { PollInterface } from './interface/poll.interface';
import { query } from 'src/db/connection';
import { RivalInterface } from './interface/rival.interface';
import { PollVoteLogInterface } from './interface/pollVoteLog.interface';
import { Poll } from 'src/entities/poll.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PollVoters } from 'src/entities/pollVoters.entity';
import { PollRivals } from 'src/entities/pollRivals.entity';

@Injectable()
export class PollService {

    constructor(
        @InjectRepository(Poll)
        private pollRepo: Repository<Poll>,

        @InjectRepository(PollVoters)
        private pollVotersRepo: Repository<PollVoters>,

        @InjectRepository(PollRivals)
        private pollRivalsRepo: Repository<PollRivals>,

    ) {

    }

    async createPoll(pollName: string, rivalsTotal: number): Promise<PollInterface> {
        try {
            const newPoll = this.pollRepo.create({
                pollName,
                pollTotalRivals: rivalsTotal
            })
            const poll: PollInterface = await this.pollRepo.save(newPoll)

            return poll
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


    async addRivalToPoll(rivalName: string, pollPrimaryKey: number): Promise<RivalInterface> {
        try {
            const newRival = this.pollRivalsRepo.create({
                rivalName, pollPk: { pk: pollPrimaryKey }
            })

            return await this.pollRivalsRepo.save(newRival)
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }



    async updateRivalVotersTotalCount(rivalPk: number, pollPk: number, rivalName: string): Promise<number> {
        try {
            const result = await query(pollQueries.updateRivalVotersCount, [
                rivalPk,
                pollPk,
                rivalName
            ])
            return result.rowCount
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


    async addPollVoter(pollVoter: PollVoteLogInterface): Promise<PollVoters> {
        try {
            const newPollVoter = this.pollVotersRepo.create({
                rivalName: pollVoter.rivalName,
                rivalPk: { pk: pollVoter.rivalPk },
                pollPk: { pk: pollVoter.pollPk },
                voterName: pollVoter.voterName,
                voterPk: { pk: pollVoter.voterPk }
            })

            return await this.pollVotersRepo.save(newPollVoter)
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    async selectFromPollVotersLog(pollPrimaryKey: number, voterPrimaryKey: number): Promise<PollVoters> {
        try {
            const log = await this.pollVotersRepo.findOne({
                where: {
                    pollPk: { pk: pollPrimaryKey },
                    voterPk: { pk: voterPrimaryKey }
                }
            })
            return log
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    async selectPollRivals(pollPrimaryKey: number): Promise<PollRivals[]> {
        try {
            const rivals = await this.pollRivalsRepo.find({
                where: {
                    pollPk: { pk: pollPrimaryKey }
                }
            })

            return rivals
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    async paginatePollToVoter(voterPk: number, limit: number, offset: number): Promise<any> {
        try {
            const result = await query(pollQueries.paginatePollToVoter, [
                voterPk,
                limit,
                offset
            ])
            return result.rows
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


    async getPollResults(pollPk: number, ): Promise<any> {
        try {
            const results = await this.pollRivalsRepo.find({
                where: {
                    pollPk: { pk: pollPk }
                }
            })
            return results

        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }
}
