export interface ConversionRequest {
  from: string;
  to: string;
  amount: number;
}

export interface ConversionResult extends ConversionRequest {
  rate: number;
  result: number;
  timestamp: Date;
}