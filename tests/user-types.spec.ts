import { test, expect, loggedOut } from '../src/fixtures/test-fixtures';
import { USERS, PRODUCTS, CHECKOUT_INFO } from '../src/data/users';

/**
 * Behaviour of the "special" SauceDemo users.
 * These users are built with deliberate defects, so the tests below document
 * the KNOWN bugs. If SauceDemo fixes one, the test will flag that it changed.
 */
test.use(loggedOut);

const { backpack, bikeLight } = PRODUCTS;

test.describe('performance_glitch_user', () => {
  test('can log in (slow) and complete a purchase', async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
    test.setTimeout(60_000);
    await loginPage.goto();
    await loginPage.login(USERS.performanceGlitch);
    await inventoryPage.expectLoaded();
    await inventoryPage.addToCart(backpack.slug);
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CHECKOUT_INFO);
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
  });
});

test.describe('problem_user (known defects)', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.problem);
  });

  test('all product images are the same (broken images)', async ({ page }) => {
    const srcs = await page.getByRole('img', { name: /Sauce Labs|Test.allTheThings/ }).evaluateAll(
      (imgs) => imgs.map((i) => (i as HTMLImageElement).getAttribute('src')),
    );
    expect(new Set(srcs).size).toBe(1);
  });

  test('"Remove" on inventory does not remove some products', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(bikeLight.slug);
    await inventoryPage.removeFromCart(bikeLight.slug).catch(() => {});
    // Known bug: the item is still in the cart
    await inventoryPage.expectCartCount(1);
  });

  test('checkout: last name field does not keep its value', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(backpack.slug);
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.lastName.fill(CHECKOUT_INFO.lastName);
    await expect(checkoutPage.lastName).not.toHaveValue(CHECKOUT_INFO.lastName);
  });
});

test.describe('error_user (known defects)', () => {
  test('some add/remove/checkout actions fail silently', async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.error);
    await inventoryPage.expectLoaded();
    await inventoryPage.addToCart(backpack.slug);
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CHECKOUT_INFO);
    await checkoutPage.finish();
    // Known bug: Finish does not complete the order for error_user
    await expect(checkoutPage.completeHeader).toHaveCount(0);
  });
});

test.describe('visual_user', () => {
  test('logs in and basic flow works (layout differs visually)', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.visual);
    await inventoryPage.expectLoaded();
    await inventoryPage.addToCart(backpack.slug);
    await inventoryPage.expectCartCount(1);
    // Visual regression example (create baseline with: npx playwright test --update-snapshots)
    // await expect(page).toHaveScreenshot('visual-user-inventory.png');
  });
});
