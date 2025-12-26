export interface WeightRecord {
  id: string;
  userId: string;
  value: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWeightInput {
  userId: string;
  value: number;
  date: Date;
}

export interface IWeightRepository {
  save(data: CreateWeightInput): Promise<WeightRecord>;
  findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<WeightRecord[]>;
}