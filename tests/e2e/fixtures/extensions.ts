import { Page, test as base } from '@playwright/test';
import { authenticateOverAPI } from '../utils/authentication';
import { userPassword, users } from '../utils/data';
import { Locators } from './locators';
import { extendPage } from './pageExtensions';
import { TransactionDetail, TransactionRow } from './transactionList';

type MyFixtures = {
  user: { username: string; password: string };
  startAuthenticated: boolean;
  page: Page;
  loc: Locators;
  transactionRow: TransactionRow;
  transactionDetail: TransactionDetail;
};

const test = base.extend<MyFixtures>({
  user: [
    {
      username: users.Heath93.username,
      password: userPassword,
    },
    {
      option: true,
    },
  ],
  startAuthenticated: true,

  page: async ({ page, request, context, user, startAuthenticated }, use) => {
    const extendedPage = extendPage(page);
    if (startAuthenticated) {
      await authenticateOverAPI({ page: extendedPage, request, context, ...user });
    }
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
