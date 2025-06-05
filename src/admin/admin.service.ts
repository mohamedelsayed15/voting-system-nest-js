import { Injectable } from '@nestjs/common';
import { AdminInterface } from './interface/admin.interface';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
  ) {}

  findAdminByPk(pk: number): Promise<AdminInterface> {
    return this.adminRepo.findOneBy({ pk });
  }

  findAdminByLoginName(loginName: string): Promise<AdminInterface> {
    return this.adminRepo.findOneBy({ loginName });
  }
}
