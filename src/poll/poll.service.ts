import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { pollQueries } from './poll.query';
import { PollInterface } from './interface/poll.interface';
import { query } from 'src/db/connection';
import { RivalInterface } from './interface/rival.interface';
import { PollVoteLogInterface } from './interface/pollVoteLog.interface';

@Injectable()
export class PollService {


    async createPoll(pollName: string, rivalsTotal: number): Promise<PollInterface> {
        try {
            const result = await query(pollQueries.createPoll, [
                pollName,
                rivalsTotal
            ])
            return result.rows[0]
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


    async addRivalToPoll(rivalName: string, pollPk: number): Promise<RivalInterface> {
        try {
            const result = await query(pollQueries.insertRival, [
                rivalName,
                pollPk
            ])
            return result.rows[0]
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


    async updatePollVotersTotalCount(pollPk: number): Promise<number> {
        try {
            const result = await query(pollQueries.updatePollVotersCount, [
                pollPk
            ])
            return result.rowCount
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


    async insertPollVoter(pollVoter: PollVoteLogInterface): Promise<PollVoteLogInterface> {
        try {
            const result = await query(pollQueries.insertIntoPollVoters, [
                pollVoter.rivalPk,
                pollVoter.rivalName,
                pollVoter.voterName,
                pollVoter.voterPk,
                pollVoter.pollPk
            ])
            return result.rows[0]
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    async selectFromPollVotersLog(pollPk: number, voterPk: number): Promise<PollVoteLogInterface> {
        try {
            const result = await query(pollQueries.selectLogFromPollVoters, [
                pollPk,
                voterPk
            ])
            return result.rows[0]
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
}
