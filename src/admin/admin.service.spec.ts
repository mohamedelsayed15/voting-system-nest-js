import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';
describe('AdminService', () => {
  let service: AdminService;
  let adminRepo: Repository<Admin>;

  const mockAdminRepo = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Admin),
          useValue: mockAdminRepo,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    adminRepo = module.get<Repository<Admin>>(getRepositoryToken(Admin));
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  describe('findAdminByPk', () => {
    it('should return an admin by primary key', async () => {
      const mockAdmin = { pk: 1, loginName: 'admin1' };
      mockAdminRepo.findOneBy.mockResolvedValue(mockAdmin);

      const result = await service.findAdminByPk(1);

      expect(result).toEqual(mockAdmin);
      expect(adminRepo.findOneBy).toHaveBeenCalledWith({ pk: 1 });
    });
  });

  describe('findAdminByLoginName', () => {
    it('should return an admin by login name', async () => {
      const mockAdmin = { pk: 1, loginName: 'admin1' };
      mockAdminRepo.findOneBy.mockResolvedValue(mockAdmin);

      const result = await service.findAdminByLoginName('admin1');

      expect(result).toEqual(mockAdmin);
      expect(adminRepo.findOneBy).toHaveBeenCalledWith({ loginName: 'admin1' });
    });
  });
});
