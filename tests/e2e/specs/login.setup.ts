import { expect, test as setup } from '../fixtures/extensions';
import { homePageUrl } from '../fixtures/urls';

setup('setup - authenticate over API and save state', async ({ loc, page, authenticateOverAPI }) => {
  await page.goto(homePageUrl);
  await authenticateOverAPI({});
  await expect(loc.banner).toBeVisible();
  await page.context().storageState({ path: 'tests/.auth/login.json' });
});
