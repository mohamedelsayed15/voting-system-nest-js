import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { pollQueries } from './poll.query';
import { PollInterface } from './interface/poll.interface';
import { query } from '../db/connection';
import { RivalInterface } from './interface/rival.interface';
import { PollVoteLogInterface } from './interface/pollVoteLog.interface';
import { Poll } from '../entities/poll.entity';
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
  ) {}

  createPoll(pollName: string, rivalsTotal: number): Promise<PollInterface> {
    const newPoll = this.pollRepo.create({
      pollName,
      pollTotalRivals: rivalsTotal,
    });
    return this.pollRepo.save(newPoll);
  }

  addRivalToPoll(
    rivalName: string,
    pollPrimaryKey: number,
  ): Promise<RivalInterface> {
    const newRival = this.pollRivalsRepo.create({
      rivalName,
      pollPk: { pk: pollPrimaryKey },
    });
    return this.pollRivalsRepo.save(newRival);
  }

  async updateRivalVotersTotalCount(
    rivalPk: number,
    pollPk: number,
    rivalName: string,
  ): Promise<number> {
    try {
      const result = await query(pollQueries.updateRivalVotersCount, [
        rivalPk,
        pollPk,
        rivalName,
      ]);
      return result.rowCount;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  addPollVoter(pollVoter: PollVoteLogInterface): Promise<PollVoters> {
    const newPollVoter = this.pollVotersRepo.create({
      rivalName: pollVoter.rivalName,
      rivalPk: { pk: pollVoter.rivalPk },
      pollPk: { pk: pollVoter.pollPk },
      voterName: pollVoter.voterName,
      voterPk: { pk: pollVoter.voterPk },
    });
    return this.pollVotersRepo.save(newPollVoter);
  }

  selectFromPollVotersLog(
    pollPrimaryKey: number,
    voterPrimaryKey: number,
  ): Promise<PollVoters> {
    return this.pollVotersRepo.findOne({
      where: {
        pollPk: { pk: pollPrimaryKey },
        voterPk: { pk: voterPrimaryKey },
      },
    });
  }

  selectPollRivals(pollPrimaryKey: number): Promise<PollRivals[]> {
    return this.pollRivalsRepo.find({
      where: {
        pollPk: { pk: pollPrimaryKey },
      },
    });
  }

  async paginatePollToVoter(
    voterPk: number,
    limit: number,
    offset: number,
  ): Promise<any> {
    try {
      const result = await query(pollQueries.paginatePollToVoter, [
        voterPk,
        limit,
        offset,
      ]);
      return result.rows;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  getPollResults(pollPk: number): Promise<any> {
    return this.pollRivalsRepo.find({
      where: {
        pollPk: { pk: pollPk },
      },
    });
  }
}
