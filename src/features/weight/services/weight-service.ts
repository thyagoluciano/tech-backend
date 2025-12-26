import { IWeightRepository } from "../interfaces/weight-repository.interface";

export class WeightService {
  constructor(private repository: IWeightRepository) {}

  async registerWeight(userId: string, value: number, dateStr?: string) {
    const date = dateStr ? new Date(dateStr) : new Date();
    return this.repository.create(userId, value, date);
  }

  async getWeeklyWeights(userId: string) {
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day;
    
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return this.repository.findByUserAndPeriod(userId, startOfWeek, endOfWeek);
  }
}