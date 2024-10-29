import { Page, test as base } from '@playwright/test';
import { authenticateOverAPI } from '../utils/authentication';
import { Locators } from './locators';
import { extendPage } from './pageExtensions';
import { TransactionDetail, TransactionRow } from './transactionList';

type MyFixtures = {
  authenticateOverAPI: (args: { username?: string; password?: string }) => Promise<void>;
  page: Page;
  loc: Locators;
  transactionRow: TransactionRow;
  transactionDetail: TransactionDetail;
};

const test = base.extend<MyFixtures>({
  authenticateOverAPI: async ({ page, request, context }, use) => {
    const authenticate = async (args: { username?: string; password?: string }) =>
      authenticateOverAPI({ page, request, context, ...args });
    await use(authenticate);
  },
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
