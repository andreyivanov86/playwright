import { test, expect } from '@playwright/test';
import Chance from 'chance'
var chance = new Chance();

const data = {
  username: 'admin',
  password: 'demo8011',
  firstName: chance.first(),
  lastName: chance.last(),
}

test.beforeEach(async ({ page }) => {
  await page.goto('https://uitest.briostacktest.com');
  await page.getByLabel('Username').fill(data.username);
  await page.getByLabel('Username').press('Tab');
  await page.getByLabel('Password').fill(data.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'briooffice' }).click();
});

test('login to brio office', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Executive Dashboard' })).toBeVisible();
});

test('create new customer using lightning', async ({ page }) => {
  await page.getByText('Customers', { exact: true }).click();
  await page.locator('[data-qa="New Customer"]').first().click();
  await page.locator('[data-qa="firstName"]').fill(data.firstName);
  await page.locator('[data-qa="lastName"]').fill(data.lastName);
  await page.locator('[formcontrolname="address1"]').fill('147 Summit Ave');
  await page.locator('[formcontrolname="postalCode"]').fill('07901');
  await page.getByRole('button', { name: 'Verify Location' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.locator('.p-element > td:nth-child(2)').first().click();
  await page.locator('#brio-currency-1').fill('10');
  await page.getByText('Reservice').click();
  await page.locator('p-radiobutton').filter({ hasText: 'No Autopay / Invoice for' }).locator('div').nth(2).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.locator('brio-sign-now p-checkbox div').nth(2).click();
  await page.locator('canvas').click({
    position: {
      x: 444,
      y: 109
    }
  });
  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page.getByText('Success', { exact: true })).toBeVisible();
  await page.getByLabel('Close').click();
  await expect(page.locator('[class="name-and-id"]')).toContainText(`${data.firstName} ${data.lastName}`);
  await expect(page.locator('[title="Customer Information"] [class="summary-contact-name"]')).toContainText(`${data.firstName} ${data.lastName}`);
});