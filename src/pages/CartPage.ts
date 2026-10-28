import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShopping: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShopping = page.getByTestId('continue-shopping');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  removeButton(slug: string) {
    return this.page.getByTestId(`remove-${slug}`);
  }

  async removeItem(slug: string) {
    await this.removeButton(slug).click();
  }

  async expectItems(names: string[]) {
    await expect(this.itemNames).toHaveText(names);
  }

  async expectEmpty() {
    await expect(this.items).toHaveCount(0);
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
