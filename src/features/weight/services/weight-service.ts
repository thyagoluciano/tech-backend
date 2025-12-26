import { IWeightRepository } from '../interfaces/weight-repository.interface';
import { createWeightSchema, CreateWeightInput } from '../schemas/weight-schema';

export class WeightService {
  constructor(private weightRepository: IWeightRepository) {}

  async registerWeight(userId: string, input: CreateWeightInput) {
    const validatedData = createWeightSchema.parse(input);

    return this.weightRepository.create({
      userId,
      value: validatedData.value,
      measuredAt: validatedData.measuredAt,
    });
  }

  async getWeeklyChartData(userId: string) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const weights = await this.weightRepository.findByPeriod(userId, startDate, endDate);

    const chartData = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dayLabel = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
      const dayWeight = weights.find(w => 
        w.measuredAt.toDateString() === currentDate.toDateString()
      );

      chartData.push({
        day: dayLabel,
        date: currentDate.toISOString().split('T')[0],
        weight: dayWeight ? dayWeight.value : 0,
      });
    }

    return chartData;
  }
}