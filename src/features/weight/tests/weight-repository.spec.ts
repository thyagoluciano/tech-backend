import { prisma } from '@/lib/prisma';
import { WeightRepositoryPOM } from './weight-repository.pom';

describe('PrismaWeightRepository', () => {
  let pom: WeightRepositoryPOM;
  const userId = 'user-123';

  beforeAll(() => {
    pom = new WeightRepositoryPOM(prisma);
  });

  beforeEach(async () => {
    await pom.cleanup();
  });

  it('should save a weight record successfully', async () => {
    const mockData = pom.generateMockWeight(userId, new Date(), 80.5);
    const result = await pom.saveWeight(mockData);

    expect(result).toHaveProperty('id');
    expect(result.value).toBe(80.5);
    expect(result.userId).toBe(userId);
  });

  it('should find weights within a specific date range', async () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-05');
    const date3 = new Date('2023-01-10');

    await pom.saveWeight(pom.generateMockWeight(userId, date1, 70));
    await pom.saveWeight(pom.generateMockWeight(userId, date2, 71));
    await pom.saveWeight(pom.generateMockWeight(userId, date3, 72));

    const results = await pom.findWeightsInRange(
      userId,
      new Date('2023-01-01'),
      new Date('2023-01-06')
    );

    expect(results).toHaveLength(2);
    expect(results[0].value).toBe(70);
    expect(results[1].value).toBe(71);
  });
});