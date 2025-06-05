import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from '../entities/poll.entity';
import { PollService } from './poll.service';

describe('PollService', () => {
  let service: PollService;
  let pollRepo: Repository<Poll>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollService,
        {
          provide: getRepositoryToken(Poll),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<PollService>(PollService);
    pollRepo = module.get<Repository<Poll>>(Poll);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('pollRepo should be defined', () => {
    expect(pollRepo).toBeDefined();
  });

  describe('createPoll', () => {});
});
