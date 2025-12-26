import { WeightService } from './weight-service';
import { IWeightRepository } from '../interfaces/weight-repository.interface';
import { Weight } from '@prisma/client';

describe('WeightService', () => {
  let service: WeightService;
  let mockRepository: jest.Mocked<IWeightRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findByPeriod: jest.fn(),
    };
    service = new WeightService(mockRepository);
  });

  it('should validate and create a weight entry', async () => {
    const userId = 'user-1';
    const input = { value: 85.5, measuredAt: new Date() };
    
    mockRepository.create.mockResolvedValue({ id: '1', ...input, userId } as Weight);

    const result = await service.registerWeight(userId, input);

    expect(result.value).toBe(85.5);
    expect(mockRepository.create).toHaveBeenCalled();
  });

  it('should throw error if weight value is negative', async () => {
    const userId = 'user-1';
    const input = { value: -10, measuredAt: new Date() };

    await expect(service.registerWeight(userId, input)).rejects.toThrow();
  });

  it('should format weekly chart data correctly', async () => {
    const userId = 'user-1';
    const mockWeights: Weight[] = [
      { id: '1', userId, value: 80, measuredAt: new Date() } as Weight
    ];
    
    mockRepository.findByPeriod.mockResolvedValue(mockWeights);

    const result = await service.getWeeklyChartData(userId);

    expect(result).toHaveLength(7);
    expect(result[6].weight).toBe(80);
  });
});