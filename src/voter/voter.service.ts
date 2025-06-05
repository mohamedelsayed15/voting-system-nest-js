import { Injectable } from '@nestjs/common';
import { VoterInterFace } from './interface/voter.interface';
import { Repository } from 'typeorm';
import { Voter } from 'src/entities/voter.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class VoterService {
  constructor(
    @InjectRepository(Voter)
    private voterRepo: Repository<Voter>,
  ) {}

  createVoter(voter: VoterInterFace): Promise<VoterInterFace> {
    const newVoter = this.voterRepo.create(voter);
    return this.voterRepo.save(newVoter);
  }

  findVoterByPk(pk: number): Promise<VoterInterFace> {
    return this.voterRepo.findOneBy({ pk });
  }

  findVoterByNationalId(nationalId: string): Promise<VoterInterFace> {
    return this.voterRepo.findOneBy({ nationalId });
  }
}
