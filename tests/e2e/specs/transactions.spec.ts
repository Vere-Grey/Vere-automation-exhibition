import { expect, test } from '../fixtures/extensions';
import { bareTransaction, commentsAndLikesTransaction } from '../fixtures/transactions.data';
import { homePageUrl, transactionsApiUrl } from '../fixtures/urls';
import { authenticateOverAPI } from '../utils/authentication';
import { delayRoute } from '../utils/routes';

const transactionsResponseData = {
  pageData: {
    page: 1,
    limit: 10,
    hasNextPages: false,
    totalPages: 1,
  },
  results: [commentsAndLikesTransaction, bareTransaction],
};

const emptyTransactionsResponseData = {
  pageData: {
    page: 1,
    limit: 10,
    hasNextPages: false,
    totalPages: 1,
  },
  results: [],
};

test.describe('Transactions list', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.goto(homePageUrl, { waitUntil: 'commit' });
    await authenticateOverAPI({ page, context });
  });

  test('transaction list have infinite loading', async ({ loc, page }) => {
    await page.waitForResponse(transactionsApiUrl);
    const initialTransactionCount = await loc.transactionItem.count();
    await loc.transactionItem.last().scrollIntoViewIfNeeded();
    await expect(async () => {
      expect(await loc.transactionItem.count()).toBeGreaterThan(initialTransactionCount);
    }).toPass({ timeout: 2000 });
  });

  test('transaction list shows no transactions', async ({ page, loc }) => {
    page.route(transactionsApiUrl, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(emptyTransactionsResponseData),
      });
    });
    await page.goto(homePageUrl, { waitUntil: 'commit' });
    await page.waitForResponse(transactionsApiUrl);
    await expect(loc.noTransactionsMessage).toBeVisible();
    await expect(loc.transactionItem).not.toBeVisible();
    await expect(loc.createTransactionButton).toBeVisible();
  });

  test('transaction list shows list skeleton when data takes longer to load', async ({ page, loc }) => {
    await page.route(transactionsApiUrl, route => delayRoute(route, 2000));
    await page.goto(homePageUrl, { waitUntil: 'commit' });
    await expect(loc.listSkeleton).toBeVisible();
    await expect(loc.grid).not.toBeVisible();
    await page.waitForResponse(transactionsApiUrl);
    await expect(loc.listSkeleton).not.toBeVisible();
    await expect(loc.grid).toBeVisible();
  });

  test('transaction list shows error when data fails to load', async ({ page, loc }) => {
    await page.route(transactionsApiUrl, route => route.fulfill({ status: 500 }));
    await page.goto(homePageUrl, { waitUntil: 'commit' });
    await page.waitForResponse(transactionsApiUrl);
    //TODO: Bug ABC-123, once fixed change the verification to check for the error message
    await expect(loc.noTransactionsMessage).toBeVisible();
  });
});

test.describe('Transaction item', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.goto(homePageUrl, { waitUntil: 'commit' });
    page.route(transactionsApiUrl, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(transactionsResponseData),
      });
    });
    await authenticateOverAPI({ page, context });
    await page.waitForResponse(transactionsApiUrl);
  });

  const testCases = [
    { name: 'Commented and Liked', transaction: commentsAndLikesTransaction },
    { name: 'Bare', transaction: bareTransaction },
  ];

  testCases.forEach(testCase => {
    test(`${testCase.name} transaction contains correct information`, async ({ transactionItem }) => {
      transactionItem.expectedData = testCase.transaction;
      await expect.soft(transactionItem.title).toBeVisible();
      await expect.soft(transactionItem.description).toBeVisible();
      await expect.soft(transactionItem.amount).toHaveText(transactionItem.expectedAmount);
      await expect.soft(transactionItem.likes).toHaveText(transactionItem.expectedLikesCount);
      await expect.soft(transactionItem.comments).toHaveText(transactionItem.expectedCommentsCount);
    });
  });
});
