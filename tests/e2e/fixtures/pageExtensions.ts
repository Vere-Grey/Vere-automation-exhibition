import { Page } from 'playwright';
import { expect } from 'playwright/test';

type ResponseProperties = 'status' | 'statusText' | 'url' | 'headers' | 'ok' | 'json' | 'text' | 'body';

declare module 'playwright' {
  interface Page {
    expectApiResponseToBe(
      url: string,
      expectedMetadata: Partial<Record<ResponseProperties, string | number | object | null>>,
    ): Promise<void>;
  }
}

export function extendPage(page: Page) {
  // See ResponseProperties type for available metadata properties that you can verify
  page.expectApiResponseToBe = async (url, expectedMetadata) => {
    const response = await page.waitForResponse(url);
    for (const key in expectedMetadata) {
      const method = response[key as ResponseProperties].bind(response);
      const value = await method();
      expect(value).toEqual(expectedMetadata[key as ResponseProperties]);
    }
  };

  // Override the page.goto method to have option waitUntil: 'commit' by default to reduce test duration
  const originalGoto = page.goto.bind(page);
  page.goto = async (url, options = {}) => {
    return await originalGoto(url, { waitUntil: 'commit', ...options });
  };

  // Override the page.reload method to have option waitUntil: 'commit' by default to reduce test duration
  const originalReload = page.reload.bind(page);
  page.reload = async (options = {}) => {
    return await originalReload({ waitUntil: 'commit', ...options });
  };

  return page;
}
