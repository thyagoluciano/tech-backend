import { describe, it, expect } from 'vitest';

describe('Environment Setup', () => {
  it('should run tests using Vitest', () => {
    expect(true).toBe(true);
  });

  it('should support ESM dynamic imports', async () => {
    const fs = await import('node:fs');
    expect(fs).toBeDefined();
  });
});