import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminService } from 'src/admin/admin.service';
import { VoterService } from 'src/voter/voter.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let adminService: AdminService;
  let voterService: VoterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            comparePasswords: jest.fn(),
            loginToken: jest.fn(),
            setTokenOnUser: jest.fn(),
          },
        },
        {
          provide: AdminService,
          useValue: {
            findAdminByLoginName: jest.fn(),
          },
        },
        {
          provide: VoterService,
          useValue: {
            findVoterByNationalId: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    adminService = module.get<AdminService>(AdminService);
    voterService = module.get<VoterService>(VoterService);
  });

  describe('login', () => {
    it('should successfully login an admin', async () => {
      const body = {
        role: 'admin',
        loginText: 'admin123',
        password: 'pass123',
      };
      const admin = { pk: 1, password: 'hashedpassword', token: '' };

      jest.spyOn(adminService, 'findAdminByLoginName').mockResolvedValue(admin);
      jest.spyOn(authService, 'comparePasswords').mockResolvedValue(true);
      jest.spyOn(authService, 'loginToken').mockResolvedValue('token123');
      jest.spyOn(authService, 'setTokenOnUser').mockResolvedValue(null);

      const result = await authController.login(body);

      expect(result).toEqual({ ...admin, password: '', token: 'token123' });
      expect(adminService.findAdminByLoginName).toHaveBeenCalledWith(
        'admin123',
      );
      expect(authService.comparePasswords).toHaveBeenCalledWith(
        'pass123',
        'hashedpassword',
      );
      expect(authService.loginToken).toHaveBeenCalledWith(admin, 'admin');
      expect(authService.setTokenOnUser).toHaveBeenCalledWith(
        1,
        'token123',
        'admin',
      );
    });

    it('should successfully login a voter', async () => {
      const body = {
        role: 'voter',
        loginText: 'voter123',
        password: 'pass123',
      };
      const voter = { pk: 2, password: 'hashedpassword', token: '' };

      jest
        .spyOn(voterService, 'findVoterByNationalId')
        .mockResolvedValue(voter);
      jest.spyOn(authService, 'comparePasswords').mockResolvedValue(true);
      jest.spyOn(authService, 'loginToken').mockResolvedValue('token456');
      jest.spyOn(authService, 'setTokenOnUser').mockResolvedValue(null);

      const result = await authController.login(body);

      expect(result).toEqual({ ...voter, password: '', token: 'token456' });
      expect(voterService.findVoterByNationalId).toHaveBeenCalledWith(
        'voter123',
      );
      expect(authService.comparePasswords).toHaveBeenCalledWith(
        'pass123',
        'hashedpassword',
      );
      expect(authService.loginToken).toHaveBeenCalledWith(voter, 'voter');
      expect(authService.setTokenOnUser).toHaveBeenCalledWith(
        2,
        'token456',
        'voter',
      );
    });

    it('should throw NotFoundException if admin not found', async () => {
      const body = {
        role: 'admin',
        loginText: 'admin123',
        password: 'pass123',
      };

      jest.spyOn(adminService, 'findAdminByLoginName').mockResolvedValue(null);

      await expect(authController.login(body)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if voter not found', async () => {
      const body = {
        role: 'voter',
        loginText: 'voter123',
        password: 'pass123',
      };

      jest.spyOn(voterService, 'findVoterByNationalId').mockResolvedValue(null);

      await expect(authController.login(body)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if password comparison fails', async () => {
      const body = {
        role: 'admin',
        loginText: 'admin123',
        password: 'pass123',
      };
      const admin = { pk: 1, password: 'hashedpassword', token: '' };

      jest.spyOn(adminService, 'findAdminByLoginName').mockResolvedValue(admin);
      jest.spyOn(authService, 'comparePasswords').mockResolvedValue(false);

      await expect(authController.login(body)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on any other error', async () => {
      const body = {
        role: 'admin',
        loginText: 'admin123',
        password: 'pass123',
      };

      jest
        .spyOn(adminService, 'findAdminByLoginName')
        .mockRejectedValue(new Error());

      await expect(authController.login(body)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
