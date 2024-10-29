import { Locator } from 'playwright';
import { expect, test } from '../fixtures/extensions';
import { bareTransaction, commentsAndLikesTransaction } from '../fixtures/transactions.data';
import { homePageUrl, transactionDetailApiUrl, transactionsApiUrl } from '../fixtures/urls';
import { authenticateOverAPI } from '../utils/authentication';
import { users } from '../utils/data';
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

//TODO: Try to find general Type for comparisonMethod and consider moving the method to utils
//Consider renaming to reflect the timeout/retry nature of the method
const expectElementCount = async (locator: Locator, comparisonMethod: 'toBeGreaterThan' | 'toBe', count: number) => {
  await expect(async () => {
    expect(await locator.count())[comparisonMethod](count);
  }).toPass({ timeout: 2000 });
};

test.describe('Transactions list', () => {
  test.beforeEach(async ({ page, request, context }) => {
    await page.goto(homePageUrl);
    await authenticateOverAPI({ page, request, context });
  });

  test('transaction list have infinite loading', async ({ loc }) => {
    await expectElementCount(loc.transactionItem, 'toBeGreaterThan', 0);
    const initialTransactionCount = await loc.transactionItem.count();
    await loc.transactionItem.last().scrollIntoViewIfNeeded();
    await expectElementCount(loc.transactionItem, 'toBeGreaterThan', initialTransactionCount);
  });

  test('transaction list shows no transactions', async ({ page, loc }) => {
    await page.route(transactionsApiUrl, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(emptyTransactionsResponseData),
      });
    });
    await page.goto(homePageUrl);
    await expect(loc.noTransactionsMessage).toBeVisible();
    await expect(loc.transactionItem).not.toBeVisible();
    await expect(loc.createTransactionButton).toBeVisible();
  });

  test('transaction list shows list skeleton when data takes longer to load', async ({ page, loc }) => {
    await page.route(transactionsApiUrl, route => delayRoute(route, 2000));
    await page.goto(homePageUrl);
    await expect(loc.listSkeleton).toBeVisible();
    await expect(loc.grid).not.toBeVisible();
    await page.waitForResponse(transactionsApiUrl);
    await expect(loc.listSkeleton).not.toBeVisible();
    await expect(loc.grid).toBeVisible();
  });

  test('transaction list shows error when data fails to load', async ({ page, loc }) => {
    await page.route(transactionsApiUrl, route => route.fulfill({ status: 500 }));
    await page.goto(homePageUrl);
    //TODO: Bug ABC-123, once fixed change the verification to check for the error message
    await expect(loc.noTransactionsMessage).toBeVisible();
  });
});

test.describe('Transaction item', () => {
  test.beforeEach(async ({ page, request, context }) => {
    await page.goto(homePageUrl);
    page.route(transactionsApiUrl, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(transactionsResponseData),
      });
    });
    const responsePromise = page.waitForResponse(transactionsApiUrl);
    await authenticateOverAPI({ page, request, context });
    await responsePromise;
  });

  const testCases = [
    { name: 'commented and liked', transaction: commentsAndLikesTransaction },
    { name: 'bare', transaction: bareTransaction },
  ];

  testCases.forEach(testCase => {
    test(`${testCase.name} transaction contains correct information`, async ({ transactionRow }) => {
      transactionRow.expectedData = testCase.transaction;
      await expect.soft(transactionRow.title).toBeVisible();
      await expect.soft(transactionRow.description).toBeVisible();
      await expect.soft(transactionRow.amount).toHaveText(transactionRow.expectedAmount);
      await expect.soft(transactionRow.likes).toHaveText(transactionRow.expectedLikesCount);
      await expect.soft(transactionRow.commentCount).toHaveText(transactionRow.expectedCommentsCount.toString());
    });
  });

  test('all transactions provided by API are visible', async ({ loc }) => {
    await expectElementCount(loc.transactionItem, 'toBe', transactionsResponseData.results.length);
  });

  test('user can open transaction details', async ({ page, transactionDetail }) => {
    page.route(transactionDetailApiUrl(commentsAndLikesTransaction.id), route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ transaction: commentsAndLikesTransaction }),
      });
    });
    transactionDetail.expectedData = commentsAndLikesTransaction;
    transactionDetail.open();
    await expect(transactionDetail.heading).toBeVisible();
    await expect.soft(transactionDetail.title).toBeVisible();
    await expect.soft(transactionDetail.description).toBeVisible();
    await expect.soft(transactionDetail.amount).toHaveText(transactionDetail.expectedAmount);
    await expect.soft(transactionDetail.likes).toHaveText(transactionDetail.expectedLikesCount);
    await transactionDetail.expectAllCommentsToBeVisible();
  });
});

test.describe('Liking and commenting on a transaction', () => {
  test.beforeEach(async ({ page, request, context, transactionDetail }, testInfo) => {
    await page.goto(homePageUrl);
    await authenticateOverAPI({ page, request, context, username: users.Heath93.username });
    const description = `${testInfo.title} ${new Date()}`;
    await transactionDetail.setupTransaction(users.Heath93.id, description);
    await transactionDetail.navigateTo();
  });

  test('user can like a transaction', async ({ transactionDetail }) => {
    await expect(transactionDetail.likes).toHaveText('0');
    await transactionDetail.likeButton.click();
    await expect(transactionDetail.likes).toHaveText('1');
    await expect(transactionDetail.likeButton).toBeDisabled();
  });

  test('user can comment a transaction', async ({ transactionDetail }) => {
    await expect(transactionDetail.commentHeader).not.toBeVisible();
    await expect(transactionDetail.comments).not.toBeVisible();
    const commentText = 'First comment';
    await transactionDetail.commentInput.fill(commentText);
    await transactionDetail.commentInput.press('Enter');
    await expect(transactionDetail.commentHeader).toBeVisible();
    await expect(transactionDetail.comments).toHaveCount(1);
    await expect(transactionDetail.comment(commentText)).toBeVisible();
  });
});
