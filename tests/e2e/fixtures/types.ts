export interface Transaction {
  receiverName: string;
  senderName: string;
  receiverAvatar: string;
  senderAvatar: string;
  likes: Like[];
  comments: _Comment[];
  id: string;
  uuid: string;
  source: string;
  amount: number;
  description: string;
  privacyLevel: string;
  receiverId: string;
  senderId: string;
  balanceAtCompletion: number;
  status: string;
  requestStatus: string;
  requestResolvedAt: string;
  createdAt: string;
  modifiedAt: string;
}

export interface Like {
  id: string;
  uuid: string;
  userId: string;
  transactionId: string;
  createdAt: string;
  modifiedAt: string;
}

export interface _Comment {
  id: string;
  uuid: string;
  content: string;
  userId: string;
  transactionId: string;
  createdAt: string;
  modifiedAt: string;
}

export type PostTransactionPayload = {
  amount: string;
  description: string;
  receiverId: string;
  senderId: string;
  transactionType: string;
};
