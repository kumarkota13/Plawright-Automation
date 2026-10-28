# SauceDemo Playwright Framework (TypeScript, Page Object Model)

## Setup
```bash
npm install
npx playwright install
```

## Run
```bash
npm test                # all tests, all browsers
npm run test:smoke      # only @smoke tests
npm run test:headed     # watch the browser
npm run test:ui         # Playwright UI mode
npx playwright test tests/cart.spec.ts --project=chromium
npm run report          # open the HTML report
```

## Structure
```
playwright.config.ts      baseURL, testIdAttribute=data-test, projects, reporters
src/data/users.ts         users, password, products, error messages
src/pages/                BasePage, LoginPage, InventoryPage, CartPage, CheckoutPage
src/fixtures/             page objects injected into tests; `loggedOut` helper
tests/auth.setup.ts       logs in once, saves session to .auth/ (reused by all tests)
tests/login.spec.ts       all 6 users, invalid creds, required fields, logout
tests/cart.spec.ts        add, validate, delete (cart + inventory page), multi-item
tests/checkout.spec.ts    E2E purchase, totals check, form validation, cancel
tests/inventory.spec.ts   product count, name/price sorting
tests/user-types.spec.ts  problem / error / performance_glitch / visual user behaviour
```

## Notes
- Tests tagged `@smoke` form a quick sanity suite.
- `user-types.spec.ts` asserts the *known* defects of the special users; if SauceDemo fixes them, those tests will fail and tell you.
