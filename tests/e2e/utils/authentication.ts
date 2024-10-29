import { APIRequestContext, APIResponse, BrowserContext, Page } from 'playwright/test';
import { userPassword, users } from './data';

interface authenticateOverAPIOptions {
  page: Page;
  request: APIRequestContext;
  context: BrowserContext;
  username?: string;
  password?: string;
}

const createAuthData = async (loginResponse: APIResponse, username: string, password: string) => {
  const user = (await loginResponse.json()).user;
  // This is object that UI would store in localStorage as string.
  // We modify this template by 'user' data from loginResponse and 'username'/'password'
  const authData = {
    actions: [
      {
        type: 'xstate.stop',
        activity: {
          src: { type: 'performLogin' },
          id: 'authentication.loading:invocation[0]',
          type: 'xstate.invoke',
        },
      },
      { type: 'redirectHomeAfterLogin' },
    ],
    activities: { 'authentication.loading:invocation[0]': false },
    meta: {},
    events: [],
    value: 'authorized',
    context: {
      user,
    },
    _event: {
      name: 'done.invoke.authentication.loading:invocation[0]',
      data: {
        type: 'done.invoke.authentication.loading:invocation[0]',
        data: {
          user,
        },
      },
      $$type: 'scxml',
      type: 'external',
      origin: 'authentication.loading:invocation[0]',
    },
    _sessionid: 'x:0',
    event: {
      type: 'done.invoke.authentication.loading:invocation[0]',
      data: {
        user,
      },
    },
    historyValue: { current: 'authorized', states: {} },
    history: {
      actions: [
        {
          type: 'xstate.start',
          activity: {
            src: { type: 'performLogin' },
            id: 'authentication.loading:invocation[0]',
            type: 'xstate.invoke',
          },
        },
      ],
      activities: {
        'authentication.loading:invocation[0]': {
          type: 'xstate.start',
          activity: {
            src: { type: 'performLogin' },
            id: 'authentication.loading:invocation[0]',
            type: 'xstate.invoke',
          },
        },
      },
      meta: {},
      events: [],
      value: 'loading',
      context: { message: 'Username or password is invalid' },
      _event: {
        name: 'LOGIN',
        data: { type: 'LOGIN', username, password },
        $$type: 'scxml',
        type: 'external',
      },
      _sessionid: 'x:0',
      event: { type: 'LOGIN', username, password },
      historyValue: { current: 'loading', states: {} },
      children: {},
      done: false,
      changed: true,
      tags: [],
    },
    children: {},
    done: false,
    changed: true,
    tags: [],
  };
  return JSON.stringify(authData);
};

const getSessionId = (loginResponse: APIResponse) => {
  const cookiesHeader = loginResponse.headers()['set-cookie'];
  if (!cookiesHeader) {
    throw new Error('Set-Cookie header not found');
  }
  const cookies = cookiesHeader.split(';');
  const sessionCookie = cookies.find((cookie: string) => cookie.startsWith('connect.sid'));
  if (!sessionCookie) {
    throw new Error('Session cookie not found');
  }
  return sessionCookie.split('=')[1];
};

export const authenticateOverAPI = async ({
  page,
  request,
  context,
  username = users.Heath93.username,
  password = userPassword,
}: authenticateOverAPIOptions) => {
  const loginResponse = await request.post('http://localhost:3001/login', {
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ type: 'LOGIN', username, password }),
  });

  if (!loginResponse.ok()) {
    throw new Error('Login request response was not ok');
  }

  const sessionId = getSessionId(loginResponse);
  const authState = await createAuthData(loginResponse, username, userPassword);
  await page.evaluate((authState: string) => {
    localStorage.setItem('authState', authState);
  }, authState);
  await context.addCookies([{ name: 'connect.sid', value: sessionId, path: '/', domain: 'localhost' }]);
  await page.reload({ waitUntil: 'commit' });
};
