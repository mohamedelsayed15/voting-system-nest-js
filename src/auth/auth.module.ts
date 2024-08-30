import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminService } from 'src/admin/admin.service';
import { VoterService } from 'src/voter/voter.service';
import { JwtModule } from '@nestjs/jwt';
import secret from './jwt-secret';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [JwtModule.register({
    secret: secret,
    signOptions: { expiresIn: '7d' }
  })],
  providers: [AuthService, AdminService, VoterService, JwtStrategy],
  controllers: [AuthController],
  exports:[AuthService,JwtStrategy]
})
export class AuthModule { }
