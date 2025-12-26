/**
 * Interface representing a currency conversion history entry
 */
export interface HistoryEntry {
  id: string;
  from: string;
  to: string;
  amount: number;
  result: number;
  timestamp: string;
}