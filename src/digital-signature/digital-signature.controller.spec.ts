import { Test, TestingModule } from '@nestjs/testing';
import { DigitalSignatureController } from './digital-signature.controller';
import { DigitalSignatureService } from './digital-signature.service';

describe('DigitalSignatureController', () => {
  let controller: DigitalSignatureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DigitalSignatureController],
      providers: [DigitalSignatureService],
    }).compile();

    controller = module.get<DigitalSignatureController>(DigitalSignatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
