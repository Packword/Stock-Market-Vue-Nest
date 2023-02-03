import { Test, TestingModule } from '@nestjs/testing';
import { EmulateApiController } from './emulate-api.controller';

describe('EmulateApiController', () => {
  let controller: EmulateApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmulateApiController],
    }).compile();

    controller = module.get<EmulateApiController>(EmulateApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
