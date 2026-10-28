import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  addButton(slug: string) {
    return this.page.getByTestId(`add-to-cart-${slug}`);
  }

  removeButton(slug: string) {
    return this.page.getByTestId(`remove-${slug}`);
  }

  async addToCart(slug: string) {
    await this.addButton(slug).click();
  }

  async removeFromCart(slug: string) {
    await this.removeButton(slug).click();
  }

  async openProduct(name: string) {
    await this.itemNames.filter({ hasText: name }).click();
  }

  async sortBy(option: SortOption) {
    await this.sortDropdown.selectOption(option);
  }

  async getNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async getPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await this.expectTitle('Products');
    await expect(this.items).toHaveCount(6);
  }
}
