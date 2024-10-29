import { Page } from 'playwright';
import { APIRequestContext, expect } from 'playwright/test';
import { createPostTransactionPayload } from './transactions.data';
import { PostTransactionPayload, Transaction } from './types';
import { transactionDetailApiUrl, transactionDetailUrl } from './urls';

const amountTestId = '[data-test="transaction-amount"]';
const likeCountTestId = '[data-test="transaction-like-count"]';

class TransactionBase {
  private _expectedData?: Transaction;

  constructor(
    public page: Page,
    public request: APIRequestContext,
  ) {}

  set expectedData(transactionItem: Transaction) {
    this._expectedData = transactionItem;
  }

  get expectedData(): Transaction {
    if (!this._expectedData) {
      throw new Error('You need to set the expected transaction data before accessing the transaction item');
    }
    return this._expectedData;
  }

  get row() {
    return this.page.locator(`[data-test="transaction-item-${this.expectedData.id}"]`);
  }

  get expectedTitle() {
    //TODO: The word paid is hardcoded here, it should be dynamic based on the transaction data
    return `${this.expectedData!.senderName} paid ${this.expectedData!.receiverName}`;
  }

  get expectedAmount() {
    //TODO: The value sign is hardcoded here, it should be dynamic based on the transaction data
    return `-$${this.expectedData!.amount / 100}`;
  }

  get expectedLikesCount() {
    return this.expectedData!.likes.length.toString();
  }

  get expectedCommentsCount() {
    return this.expectedData!.comments.length;
  }

  //TODO: Refactor once we have more API calls
  postTransaction = async (payload: PostTransactionPayload): Promise<Transaction> => {
    const response = await this.request.post('http://localhost:3001/transactions', {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(payload),
    });

    if (!response.ok()) {
      const errorText = await response.text();
      console.error('Request failed with response:', {
        status: response.status(),
        statusText: response.statusText(),
        body: errorText,
      });
      throw new Error('Request response was not ok');
    }
    return (await response.json()).transaction;
  };

  setupTransaction = async (userId: string, description: string) => {
    const newTransactionPayload = createPostTransactionPayload(userId, description);
    const transaction = await this.postTransaction(newTransactionPayload);
    this.expectedData = transaction;
  };
}

export class TransactionRow extends TransactionBase {
  constructor(page: Page, request: APIRequestContext) {
    super(page, request);
  }

  get title() {
    return this.row.getByText(this.expectedTitle);
  }

  get description() {
    return this.row.getByText(this.expectedData.description);
  }

  get amount() {
    return this.row.locator(amountTestId);
  }

  get likes() {
    return this.row.locator(likeCountTestId);
  }

  get commentCount() {
    return this.row.locator('[data-test="transaction-comment-count"]');
  }
}

export class TransactionDetail extends TransactionBase {
  readonly amount = this.page.locator(amountTestId);
  readonly likes = this.page.locator(likeCountTestId);
  readonly heading = this.page.getByRole('heading', { name: 'Transaction Detail' });
  readonly likeButton = this.page.locator('[data-test="transaction-like-button"]');
  readonly comments = this.page.locator('[data-testid="comment-list-item"]');
  readonly commentHeader = this.page.getByRole('heading', { name: 'Comments' });
  readonly commentInput = this.page.getByPlaceholder('Write a comment...');
  readonly comment = (text: string) => this.comments.getByText(text);

  constructor(page: Page, request: APIRequestContext) {
    super(page, request);
  }

  get title() {
    return this.page.getByText(this.expectedTitle);
  }

  get description() {
    return this.page.getByText(this.expectedData.description);
  }

  waitForResponse = async () => {
    await this.page.waitForResponse(transactionDetailApiUrl(this.expectedData.id));
  };

  open = async () => {
    const responsePromise = this.waitForResponse();
    //TODO: The row can be on different page. We should scroll to it before clicking
    await this.row.click();
    await responsePromise;
  };

  navigateTo = async () => await this.page.goto(transactionDetailUrl(this.expectedData.id));

  expectAllCommentsToBeVisible = async () => {
    await expect.soft(this.comments).toHaveCount(this.expectedCommentsCount);
    for (const comment of this.expectedData.comments) {
      await expect.soft(this.comments.getByText(comment.content)).toBeVisible();
    }
    const textsDisplayed = await this.comments.allTextContents();
    const textsExpected = this.expectedData.comments.map(comment => comment.content);
    expect(textsDisplayed).toEqual(textsExpected);
  };
}
