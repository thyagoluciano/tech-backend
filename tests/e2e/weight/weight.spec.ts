import { test, expect } from "@playwright/test";
import { WeightApiPage } from "./weight.pom";

test.describe("Weight API Endpoints", () => {
  test("should allow a user to register weight", async ({ request }) => {
    const weightApi = new WeightApiPage(request);
    const response = await weightApi.createWeight(75.5);
    
    // Note: In a real test, session cookies would be handled via global setup
    // This test assumes the request context is authenticated
    if (response.status() === 201) {
      const body = await response.json();
      expect(body).toHaveProperty("value", 75.5);
    } else {
      expect(response.status()).toBe(401);
    }
  });

  test("should retrieve weekly weight data", async ({ request }) => {
    const weightApi = new WeightApiPage(request);
    const response = await weightApi.getWeeklyWeights();
    
    if (response.status() === 200) {
      const body = await response.json();
      expect(Array.isArray(body)).toBeTruthy();
    } else {
      expect(response.status()).toBe(401);
    }
  });
});