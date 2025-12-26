import { test } from "@playwright/test";
import { WeightLogPage } from "./pages/weight-log-page";

test.describe("Weight Log Feature", () => {
  test("should log weight successfully with valid data", async ({ page }) => {
    const weightPage = new WeightLogPage(page);
    await weightPage.navigate();
    await weightPage.fillWeight("82.5");
    await weightPage.submit();
    await weightPage.expectSuccessMessage();
  });

  test("should show error for negative weight", async ({ page }) => {
    const weightPage = new WeightLogPage(page);
    await weightPage.navigate();
    await weightPage.fillWeight("-5");
    await weightPage.submit();
    await weightPage.expectErrorMessage("Weight must be a positive value");
  });
});