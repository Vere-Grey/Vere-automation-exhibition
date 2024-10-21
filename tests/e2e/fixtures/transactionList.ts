import { Page } from 'playwright';
import { Transaction } from './types';

export class TransactionItem {
  _expectedData?: Transaction;
  item = () => this.page.locator(`[data-test="transaction-item-${this.expectedData.id}"]`);

  constructor(public page: Page) {}

  set expectedData(transactionItem: Transaction) {
    this._expectedData = transactionItem;
  }

  get expectedData(): Transaction {
    if (!this._expectedData) {
      throw new Error('You need to set the expected transaction data before accessing the transaction item');
    }
    return this._expectedData;
  }

  get title() {
    //TODO: The word paid is hardcoded here, it should be dynamic based on the transaction data
    return this.item().getByText(`${this.expectedData!.senderName} paid ${this.expectedData!.receiverName}`);
  }

  get description() {
    return this.item().getByText(`Payment: ${this.expectedData!.senderId} to ${this.expectedData!.receiverId}`);
  }

  get amount() {
    return this.item().locator('[data-test="transaction-amount"]');
  }

  get expectedAmount() {
    //TODO: The value sign is hardcoded here, it should be dynamic based on the transaction data
    return `-$${this.expectedData!.amount / 100}`;
  }

  get likes() {
    return this.item().locator('[data-test="transaction-like-count"]');
  }

  get expectedLikesCount() {
    return this.expectedData!.likes.length.toString();
  }

  get comments() {
    return this.item().locator('[data-test="transaction-comment-count"]');
  }

  get expectedCommentsCount() {
    return this.expectedData!.comments.length.toString();
  }
}
