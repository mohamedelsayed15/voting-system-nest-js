import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AdminInterface } from './interface/admin.interface';
import { Repository } from 'typeorm';
import { Admin } from 'src/entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdminService {

    constructor(
        @InjectRepository(Admin)
        private adminRepo: Repository<Admin>
    ) { }

    async findAdminByPk(pk: number): Promise<AdminInterface> {
        try {
            return await this.adminRepo.findOneBy({ pk })
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    async findAdminByLoginName(loginName: string): Promise<AdminInterface> {
        try {
            return await this.adminRepo.findOneBy({ loginName })
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

}
