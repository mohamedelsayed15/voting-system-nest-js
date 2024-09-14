import { Module } from '@nestjs/common';
import { VoterService } from './voter.service';
import { VoterController } from './voter.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voter } from 'src/entities/voter.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Voter])],
  providers: [VoterService,],
  controllers: [VoterController]
})
export class VoterModule { }
