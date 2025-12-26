import { BasePage } from './base-page';

export class LoginPage extends BasePage {
  private readonly emailInput = 'input[name="email"]';
  private readonly passwordInput = 'input[name="password"]';
  private readonly submitButton = 'button[type="submit"]';

  async login(email: string, pass: string) {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, pass);
    await this.page.click(this.submitButton);
  }
}