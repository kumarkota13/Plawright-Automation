import { test, expect, loggedOut } from '../src/fixtures/test-fixtures';
import { USERS, LOGIN_OK_USERS, ERRORS, PASSWORD } from '../src/data/users';

test.use(loggedOut);

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => loginPage.goto());

  for (const user of LOGIN_OK_USERS) {
    test(`@smoke ${user} can log in`, async ({ loginPage, inventoryPage }) => {
      await loginPage.login(user);
      await loginPage.expectLoggedIn();
      await inventoryPage.expectTitle('Products');
    });
  }

  test('locked_out_user is blocked', async ({ loginPage, page }) => {
    await loginPage.login(USERS.lockedOut);
    await loginPage.expectError(ERRORS.lockedOut);
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('wrong password is rejected', async ({ loginPage }) => {
    await loginPage.login(USERS.standard, 'wrong_password');
    await loginPage.expectError(ERRORS.invalidCreds);
  });

  test('username is required', async ({ loginPage }) => {
    await loginPage.login('', PASSWORD);
    await loginPage.expectError(ERRORS.usernameRequired);
  });

  test('password is required', async ({ loginPage }) => {
    await loginPage.login(USERS.standard, '');
    await loginPage.expectError(ERRORS.passwordRequired);
  });

  test('inventory is protected when logged out', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await loginPage.expectError(ERRORS.notLoggedIn);
  });

  test('user can log out', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(USERS.standard);
    await inventoryPage.logout();
    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
