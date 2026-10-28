import { test, expect } from '../src/fixtures/test-fixtures';
import { PRODUCTS } from '../src/data/users';

const { backpack, bikeLight, onesie } = PRODUCTS;

test.describe('Cart: add / validate / delete', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.expectLoaded();
  });

  test('@smoke add a product and validate it in the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(backpack.slug);
    await expect(inventoryPage.removeButton(backpack.slug)).toBeVisible(); // button toggles
    await inventoryPage.expectCartCount(1);

    await inventoryPage.openCart();
    await cartPage.expectTitle('Your Cart');
    await cartPage.expectItems([backpack.name]);
  });

  test('@smoke delete a product from the cart page', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(backpack.slug);
    await inventoryPage.openCart();
    await cartPage.removeItem(backpack.slug);
    await cartPage.expectEmpty();
    await cartPage.expectCartCount(0);
  });

  test('remove a product from the inventory page', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(bikeLight.slug);
    await inventoryPage.expectCartCount(1);
    await inventoryPage.removeFromCart(bikeLight.slug);
    await expect(inventoryPage.addButton(bikeLight.slug)).toBeVisible();
    await inventoryPage.expectCartCount(0);
  });

  test('add multiple products then delete one', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(backpack.slug);
    await inventoryPage.addToCart(bikeLight.slug);
    await inventoryPage.addToCart(onesie.slug);
    await inventoryPage.expectCartCount(3);

    await inventoryPage.openCart();
    await cartPage.expectItems([backpack.name, bikeLight.name, onesie.name]);

    await cartPage.removeItem(bikeLight.slug);
    await cartPage.expectItems([backpack.name, onesie.name]);
    await cartPage.expectCartCount(2);
  });

  test('cart persists when continuing shopping', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(backpack.slug);
    await inventoryPage.openCart();
    await cartPage.continueShopping.click();
    await inventoryPage.expectCartCount(1);
    await expect(inventoryPage.removeButton(backpack.slug)).toBeVisible();
  });

  test('add product from its detail page', async ({ page, inventoryPage, cartPage }) => {
    await inventoryPage.openProduct(backpack.name);
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.getByTestId('inventory-item-name')).toHaveText(backpack.name);
    await expect(page.getByTestId('inventory-item-price')).toHaveText(`$${backpack.price}`);
    await page.getByTestId(`add-to-cart`).click();
    await inventoryPage.expectCartCount(1);
    await inventoryPage.openCart();
    await cartPage.expectItems([backpack.name]);
  });
});
