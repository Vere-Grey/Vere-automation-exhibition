import { test as base } from "@playwright/test";
import { Locators } from "./locators";

type MyFixtures = {
  loc: Locators;
};

const test = base.extend<MyFixtures>({
  loc: async ({ page }, use) => {
    await use(new Locators(page));
  },
});

export { expect } from "@playwright/test";
export { test };
