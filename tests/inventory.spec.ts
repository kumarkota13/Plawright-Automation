import { test, expect } from '../src/fixtures/test-fixtures';

test.describe('Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => inventoryPage.goto());

  test('shows 6 products', async ({ inventoryPage }) => {
    await inventoryPage.expectLoaded();
  });

  test('sort by name A to Z / Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');
    const az = await inventoryPage.getNames();
    expect(az).toEqual([...az].sort());
    await inventoryPage.sortBy('za');
    const za = await inventoryPage.getNames();
    expect(za).toEqual([...za].sort().reverse());
  });

  test('sort by price low to high / high to low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const lo = await inventoryPage.getPrices();
    expect(lo).toEqual([...lo].sort((a, b) => a - b));
    await inventoryPage.sortBy('hilo');
    const hi = await inventoryPage.getPrices();
    expect(hi).toEqual([...hi].sort((a, b) => b - a));
  });
});
