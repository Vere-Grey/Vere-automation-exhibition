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
  page.expectApiResponseToBe = async (url, expectedMetadata) => {
    const response = await page.waitForResponse(url);
    for (const key in expectedMetadata) {
      const method = response[key as ResponseProperties].bind(response);
      const value = await method();
      expect(value).toEqual(expectedMetadata[key as ResponseProperties]);
    }
  };

  return page;
}
