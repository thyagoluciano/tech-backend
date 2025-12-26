import { readFile, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { ApiResponse } from '../types/api.js';
import { HistoryEntry } from '../types/history.js';
import { HistoryEntrySchema } from '../schemas/history.schema.js';

export class HistoryRepository {
  private readonly filePath: string;

  constructor() {
    this.filePath = join(process.cwd(), 'history.json');
  }

  /**
   * Ensures the history.json file exists, creating it with an empty array if not.
   */
  private async ensureFile(): Promise<void> {
    try {
      await access(this.filePath);
    } catch {
      await writeFile(this.filePath, JSON.stringify([]));
    }
  }

  /**
   * Retrieves all conversion history records.
   */
  async getAll(): Promise<ApiResponse<HistoryEntry[]>> {
    try {
      await this.ensureFile();
      const data = await readFile(this.filePath, 'utf-8');
      const history = JSON.parse(data) as HistoryEntry[];
      return { success: true, data: history };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to read history file'
      };
    }
  }

  /**
   * Saves a new conversion entry to the history file.
   */
  async save(entry: HistoryEntry): Promise<ApiResponse<HistoryEntry>> {
    const validation = HistoryEntrySchema.safeParse(entry);
    
    if (!validation.success) {
      return {
        success: false,
        error: `Validation failed: ${validation.error.errors.map(e => e.message).join(', ')}`
      };
    }

    try {
      const currentHistoryResult = await this.getAll();
      const history = currentHistoryResult.success ? (currentHistoryResult.data || []) : [];
      
      history.push(entry);
      
      await writeFile(this.filePath, JSON.stringify(history, null, 2));
      return { success: true, data: entry };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save history entry'
      };
    }
  }
}