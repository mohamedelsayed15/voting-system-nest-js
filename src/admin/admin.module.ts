import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from 'src/entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule { }
