import { Page, Route } from 'playwright';

declare module 'playwright' {
  interface Page {
    delayedRoute(url: string, delayTime: number): Promise<void>;
  }
}

export function extendPage(page: Page) {
  page.delayedRoute = async (url: string, delayTime: number) => {
    await page.route(url, async (route: Route) => {
      await new Promise(resolve => setTimeout(resolve, delayTime));
      await route.continue();
    });
  };
  return page;
}