import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { query } from 'src/db/connection';
import { VoterInterFace } from './interface/voter.interface';
import { voterQueries } from './voter.query';
@Injectable()
export class VoterService {

    async createVoter(voter: VoterInterFace): Promise<VoterInterFace> {
        try {
            const result = await query(voterQueries.createVoter, [
                voter.firstName,
                voter.secondName,
                voter.nationalId,
                voter.password
            ])
            return result.rows[0]
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    async selectVoterByNationalIdoRPk(value: string | number, by: "nationalId" | "pk"): Promise<VoterInterFace> {
        let selectVoterByNIDoRPkQuery = `
        SELECT *
        FROM vs.voter
        WHERE "${by}" = $1
        `
        try {
            const result = await query(selectVoterByNIDoRPkQuery, [
                value
            ])
            return result.rows[0]
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


}
