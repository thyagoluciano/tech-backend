import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

describe('Project Folder Structure', () => {
  const requiredFolders = [
    'src/repositories',
    'src/services',
    'src/schemas',
    'src/tests'
  ];

  it.each(requiredFolders)('should verify that directory %s exists', (folder) => {
    const path = join(process.cwd(), folder);
    expect(existsSync(path)).toBe(true);
  });
});