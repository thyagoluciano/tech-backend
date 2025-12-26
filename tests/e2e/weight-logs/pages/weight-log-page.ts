import { Page, expect } from "@playwright/test";

export class WeightLogPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto("/dashboard/weight");
  }

  async fillWeight(value: string) {
    await this.page.fill('input[name="weight"]', value);
  }

  async submit() {
    await this.page.click('button[type="submit"]');
  }

  async expectSuccessMessage() {
    await expect(this.page.locator("text=Weight logged successfully")).toBeVisible();
  }

  async expectErrorMessage(message: string) {
    await expect(this.page.locator(`text=${message}`)).toBeVisible();
  }
}