import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { HistoryRepository } from '../repositories/history.repository.js';
import { HistoryEntry } from '../types/history.js';

describe('HistoryRepository', () => {
  const repo = new HistoryRepository();
  const testFilePath = join(process.cwd(), 'history.json');

  beforeEach(async () => {
    try {
      await rm(testFilePath);
    } catch {}
  });

  afterEach(async () => {
    try {
      await rm(testFilePath);
    } catch {}
  });

  it('should save and retrieve history entries', async () => {
    const entry: HistoryEntry = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      from: 'USD',
      to: 'BRL',
      amount: 100,
      result: 500,
      timestamp: new Date().toISOString()
    };

    const saveResult = await repo.save(entry);
    expect(saveResult.success).toBe(true);
    expect(saveResult.data).toEqual(entry);

    const getAllResult = await repo.getAll();
    expect(getAllResult.success).toBe(true);
    expect(getAllResult.data).toHaveLength(1);
    expect(getAllResult.data?.[0]).toEqual(entry);
  });

  it('should return error for invalid entry data', async () => {
    const invalidEntry = {
      id: 'invalid-uuid',
      from: 'INVALID',
      to: 'B',
      amount: -10,
      result: 0,
      timestamp: 'not-a-date'
    } as any;

    const result = await repo.save(invalidEntry);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});