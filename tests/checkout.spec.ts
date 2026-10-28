import { test, expect } from '../src/fixtures/test-fixtures';
import { PRODUCTS, CHECKOUT_INFO, ERRORS } from '../src/data/users';

const { backpack, bikeLight } = PRODUCTS;

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(backpack.slug);
    await inventoryPage.addToCart(bikeLight.slug);
    await inventoryPage.openCart();
  });

  test('@smoke complete an end-to-end purchase', async ({ cartPage, checkoutPage, page }) => {
    await cartPage.checkout();
    await checkoutPage.fillInfo(CHECKOUT_INFO);
    await checkoutPage.expectTitle('Checkout: Overview');
    await checkoutPage.expectTotalsCorrect();
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
    await checkoutPage.expectCartCount(0);
    await checkoutPage.backHome.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  const missing = [
    { field: 'firstName', info: { ...CHECKOUT_INFO, firstName: '' }, error: ERRORS.firstNameRequired },
    { field: 'lastName', info: { ...CHECKOUT_INFO, lastName: '' }, error: ERRORS.lastNameRequired },
    { field: 'postalCode', info: { ...CHECKOUT_INFO, postalCode: '' }, error: ERRORS.postalRequired },
  ];
  for (const { field, info, error } of missing) {
    test(`validation: ${field} is required`, async ({ cartPage, checkoutPage }) => {
      await cartPage.checkout();
      await checkoutPage.fillInfo(info);
      await checkoutPage.expectError(error);
    });
  }

  test('cancel on overview returns to inventory with cart intact', async ({ cartPage, checkoutPage, inventoryPage, page }) => {
    await cartPage.checkout();
    await checkoutPage.fillInfo(CHECKOUT_INFO);
    await checkoutPage.cancelButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
    await inventoryPage.expectCartCount(2);
  });
});
