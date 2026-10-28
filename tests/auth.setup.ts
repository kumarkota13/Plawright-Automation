import { test as setup } from '../src/fixtures/test-fixtures';
import { USERS } from '../src/data/users';

setup('authenticate as standard_user', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.login(USERS.standard);
  await loginPage.expectLoggedIn();
  await page.context().storageState({ path: '.auth/standard_user.json' });
});
