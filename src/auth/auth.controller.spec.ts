import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminService } from 'src/admin/admin.service';
import { VoterService } from 'src/voter/voter.service';
import { NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { query } from "../db/connection"

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [], // If your controller depends on any services
        }).compile();

        controller = module.get<AuthController>(AuthController);

        controller.login({
            "loginText": "",
            "password": "",
            "role": "voter"
        })
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // Additional test cases here
});
