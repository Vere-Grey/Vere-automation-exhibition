import { Page, test as base } from '@playwright/test';
import { Locators } from './locators';
import { extendPage } from './pageExtensions';

type MyFixtures = {
  loc: Locators;
  page: Page;
};

const test = base.extend<MyFixtures>({
  page: async ({ page }, use) => {
    const extendedPage = extendPage(page);
    await use(extendedPage);
  },
  loc: async ({ page }, use) => {
    await use(new Locators(page));
  },
});

export { expect } from '@playwright/test';
export { test };
