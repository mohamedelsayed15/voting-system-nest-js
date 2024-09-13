import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { query } from 'src/db/connection';
import { AdminInterface } from './interface/admin.interface';
import { Repository } from 'typeorm';
import { Admin } from 'src/entities/admin.entity';

@Injectable()
export class AdminService {

    constructor(private adminRepo: Repository<Admin>) { }

    async selectAdminByLoginNameOrPk(value: string | number, by: "loginName" | "pk"): Promise<AdminInterface> {
        try {
            const admin = await this.adminRepo.findOneBy({ [`${by}`]: value })
            return admin
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    // async selectAdminByLoginNameOrPk(value: string | number, by: "loginName" | "pk"): Promise<AdminInterface> {
    //     let selectVoterByNIDoRPkQuery = `
    //     SELECT *
    //     FROM vs.admin
    //     WHERE "${by}" = $1
    //     `
    //     try {
    //         const result = await query(selectVoterByNIDoRPkQuery, [
    //             value
    //         ])
    //         return result.rows[0]
    //     } catch (e) {
    //         console.log(e)
    //         throw new InternalServerErrorException()
    //     }
    // }
}
