import { Route } from 'playwright';
import { expect } from 'playwright/test';

export const delayRoute = async (route: Route, ms: number) => {
  await new Promise(resolve => setTimeout(resolve, ms));
  await route.continue();
};

export const expectPayloadToBe = async (route: Route, expectedPayload: object) => {
  const request = route.request();
  const postData = request.postDataJSON();
  expect(postData).toEqual(expectedPayload);
  route.continue();
};
