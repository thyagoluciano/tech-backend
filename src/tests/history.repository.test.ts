import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { HistoryRepository } from '../repositories/history.repository.js';
import { HistoryEntry } from '../types/history.js';

describe('HistoryRepository', () => {
  const repository = new HistoryRepository();
  const filePath = join(process.cwd(), 'history.json');

  const cleanup = async () => {
    try { await rm(filePath); } catch {}
  };

  beforeEach(cleanup);
  afterEach(cleanup);

  it('should create history.json with empty array if it does not exist', async () => {
    const result = await repository.getAll();
    expect(result.success).toBe(true);
    expect(result.data).toEqual([]);
  });

  it('should save and retrieve a valid history entry', async () => {
    const entry: HistoryEntry = {
      from: 'USD',
      to: 'BRL',
      amount: 100,
      convertedAmount: 500,
      rate: 5.0,
      timestamp: new Date().toISOString(),
    };

    const saveResult = await repository.save(entry);
    expect(saveResult.success).toBe(true);
    expect(saveResult.data).toEqual(entry);

    const getAllResult = await repository.getAll();
    expect(getAllResult.data).toContainEqual(entry);
  });

  it('should append multiple entries correctly', async () => {
    const entry1: HistoryEntry = { from: 'USD', to: 'EUR', amount: 10, convertedAmount: 9, rate: 0.9, timestamp: new Date().toISOString() };
    const entry2: HistoryEntry = { from: 'EUR', to: 'GBP', amount: 20, convertedAmount: 16, rate: 0.8, timestamp: new Date().toISOString() };

    await repository.save(entry1);
    await repository.save(entry2);

    const result = await repository.getAll();
    expect(result.data).toHaveLength(2);
    expect(result.data).toEqual([entry1, entry2]);
  });

  it('should fail validation for invalid currency codes', async () => {
    const invalidEntry = {
      from: 'USDT', // 4 chars, schema expects 3
      to: 'BRL',
      amount: 100,
      convertedAmount: 500,
      rate: 5.0,
      timestamp: new Date().toISOString(),
    } as any;

    const result = await repository.save(invalidEntry);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Validation failed');
  });

  it('should fail validation for negative amounts', async () => {
    const invalidEntry = {
      from: 'USD',
      to: 'BRL',
      amount: -10,
      convertedAmount: 500,
      rate: 5.0,
      timestamp: new Date().toISOString(),
    } as any;

    const result = await repository.save(invalidEntry);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Validation failed');
  });
});