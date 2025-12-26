/**
 * Standard API Response format as defined in AGENTS.md
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}