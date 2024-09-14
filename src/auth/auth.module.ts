import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminService } from 'src/admin/admin.service';
import { VoterService } from 'src/voter/voter.service';
import { JwtModule } from '@nestjs/jwt';
import secret from './jwt-secret';
import { JwtStrategy } from './jwt.strategy';
import { AdminModule } from 'src/admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voter } from 'src/entities/voter.entity';

@Module({
  imports: [JwtModule.register({
    secret: secret,
    signOptions: { expiresIn: '7d' }
  }),
    AdminModule,
    TypeOrmModule.forFeature([Voter])
  ],
  providers: [AuthService, VoterService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy]
})
export class AuthModule { }
