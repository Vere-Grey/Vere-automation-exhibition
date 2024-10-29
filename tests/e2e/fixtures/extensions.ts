import { Page, test as base } from '@playwright/test';
import { Locators } from './locators';
import { extendPage } from './pageExtensions';
import { TransactionDetail, TransactionRow } from './transactionList';

type MyFixtures = {
  loc: Locators;
  page: Page;
  transactionRow: TransactionRow;
  transactionDetail: TransactionDetail;
};

const test = base.extend<MyFixtures>({
  page: async ({ page }, use) => {
    const extendedPage = extendPage(page);
    await use(extendedPage);
  },
  loc: async ({ page }, use) => {
    await use(new Locators(page));
  },
  transactionRow: async ({ page, request }, use) => {
    await use(new TransactionRow(page, request));
  },
  transactionDetail: async ({ page, request }, use) => {
    await use(new TransactionDetail(page, request));
  },
});

export { expect } from '@playwright/test';
export { test };
