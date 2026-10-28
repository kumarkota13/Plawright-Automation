import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly title: Locator;

  constructor(protected readonly page: Page) {
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.title = page.getByTestId('title');
  }

  async expectTitle(text: string) {
    await expect(this.title).toHaveText(text);
  }

  async expectCartCount(count: number) {
    if (count === 0) await expect(this.cartBadge).toHaveCount(0);
    else await expect(this.cartBadge).toHaveText(String(count));
  }

  async openCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
