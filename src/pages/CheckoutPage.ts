import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly itemPrices: Locator;
  readonly completeHeader: Locator;
  readonly backHome: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.finishButton = page.getByTestId('finish');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.completeHeader = page.getByTestId('complete-header');
    this.backHome = page.getByTestId('back-to-products');
    this.error = page.getByTestId('error');
  }

  async fillInfo(info: { firstName: string; lastName: string; postalCode: string }) {
    await this.firstName.fill(info.firstName);
    await this.lastName.fill(info.lastName);
    await this.postalCode.fill(info.postalCode);
    await this.continueButton.click();
  }

  private parseMoney(text: string): number {
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async expectTotalsCorrect() {
    const prices = (await this.itemPrices.allTextContents()).map((t) => this.parseMoney(t));
    const expectedSubtotal = prices.reduce((a, b) => a + b, 0);
    const subtotal = this.parseMoney(await this.subtotal.innerText());
    const tax = this.parseMoney(await this.tax.innerText());
    const total = this.parseMoney(await this.total.innerText());
    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  }

  async finish() {
    await this.finishButton.click();
  }

  async expectOrderComplete() {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  async expectError(message: string) {
    await expect(this.error).toContainText(message);
  }
}
