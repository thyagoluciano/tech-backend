import { describe, it, expect } from 'vitest';
import type { ApiResponse } from '../types/api.js';

describe('API Types Validation', () => {
  it('should validate a successful ApiResponse object structure', () => {
    const response: ApiResponse<string> = {
      success: true,
      data: "success_message"
    };
    expect(response.success).toBe(true);
    expect(response.data).toBe("success_message");
    expect(response.error).toBeUndefined();
  });

  it('should validate an error ApiResponse object structure', () => {
    const response: ApiResponse<null> = {
      success: false,
      error: "Internal Server Error"
    };
    expect(response.success).toBe(false);
    expect(response.error).toBe("Internal Server Error");
    expect(response.data).toBeUndefined();
  });
});