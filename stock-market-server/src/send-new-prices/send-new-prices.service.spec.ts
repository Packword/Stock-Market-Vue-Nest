import { Test, TestingModule } from '@nestjs/testing';
import { SendNewPricesService } from './send-new-prices.service';

describe('SendNewPricesService', () => {
  let service: SendNewPricesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendNewPricesService],
    }).compile();

    service = module.get<SendNewPricesService>(SendNewPricesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
