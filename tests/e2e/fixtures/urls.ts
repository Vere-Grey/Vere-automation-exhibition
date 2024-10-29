// Pages
export const homePageUrl = '/';
export const signinPageUrl = '/signin';
export const signupPageUrl = '/signup';
export const transactionDetailUrl = (transactionId: string) => `/transaction/${transactionId}`;

// API
export const usersApiUrl = '**/users';
export const loginApiUrl = '**/login';
export const transactionsApiUrl = '**/transactions/public**';
export const transactionDetailApiUrl = (transactionId: string) => `**/transactions/${transactionId}`;
