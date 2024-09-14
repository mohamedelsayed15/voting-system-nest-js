import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { VoterInterFace } from './interface/voter.interface';
import { Repository } from 'typeorm';
import { Voter } from 'src/entities/voter.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class VoterService {

    constructor(
        @InjectRepository(Voter)
        private voterRepo: Repository<Voter>) {

    }

    async createVoter(voter: VoterInterFace): Promise<VoterInterFace> {
        try {
            const newVoter = this.voterRepo.create({
                nationalId: voter.nationalId,
                password: voter.password,
                firstName: voter.firstName,
                secondName: voter.secondName
            })

            return await this.voterRepo.save(newVoter)
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    async findVoterByPk(pk: number): Promise<VoterInterFace> {
        try {
            const voter = await this.voterRepo.findOneBy({ pk })
            return voter
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }
    async findVoterByNationalId(nationalId: string): Promise<VoterInterFace> {
        try {
            const voter = await this.voterRepo.findOneBy({ nationalId })
            return voter
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


}
