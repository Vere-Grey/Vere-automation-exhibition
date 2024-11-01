import { randomlyChosenUser } from '../utils/data';
import { PostTransactionPayload, Transaction } from './types';

export const commentsAndLikesTransaction: Transaction = {
  receiverName: 'Lia Rosenbaum',
  senderName: 'Darrel Ortiz',
  receiverAvatar: 'https://avatars.dicebear.com/api/human/WHjJ4qR2R2.svg',
  senderAvatar: 'https://avatars.dicebear.com/api/human/_XblMqbuoP.svg',
  likes: [
    {
      id: 'trxjt3_kUZLD',
      uuid: '7deebbdc-e5cd-4ca5-9746-5826ef744f15',
      userId: 'M1ty1gR8B3',
      transactionId: '6XY0Ud1i8sp4',
      createdAt: '2023-08-19T10:12:08.946Z',
      modifiedAt: '2024-03-07T05:38:00.043Z',
    },
    {
      id: 'bg8F4haR2zc0',
      uuid: '2cdddebc-6a47-437b-ae76-ebd89432b158',
      userId: 'uBmeaz5pX',
      transactionId: '6XY0Ud1i8sp4',
      createdAt: '2023-06-30T22:44:58.232Z',
      modifiedAt: '2024-03-07T15:15:26.116Z',
    },
  ],
  comments: [
    {
      id: 'O41hnsNiBPe8',
      uuid: '4b5a4df8-ef12-4d50-9061-a9e4bc026204',
      content: 'awesome comment',
      userId: 'M1ty1gR8B3',
      transactionId: '6XY0Ud1i8sp4',
      createdAt: '2023-06-15T17:58:29.565Z',
      modifiedAt: '2024-03-07T12:07:29.959Z',
    },
  ],
  id: '6XY0Ud1i8sp4',
  uuid: 'f38d8926-5312-4512-a1bc-03a4f19b5ccb',
  source: 'u38OUb2kt0L',
  amount: 31231,
  description: 'Payment: _XblMqbuoP to WHjJ4qR2R2',
  privacyLevel: 'public',
  receiverId: 'WHjJ4qR2R2',
  senderId: '_XblMqbuoP',
  balanceAtCompletion: 39724,
  status: 'complete',
  requestStatus: '',
  requestResolvedAt: '2024-03-25T09:15:44.612Z',
  createdAt: '2023-04-07T11:58:43.058Z',
  modifiedAt: '2024-03-07T21:40:13.977Z',
};

export const bareTransaction: Transaction = {
  receiverName: 'Ted Parisian',
  senderName: 'Lia Rosenbaum',
  receiverAvatar: 'https://avatars.dicebear.com/api/human/uBmeaz5pX.svg',
  senderAvatar: 'https://avatars.dicebear.com/api/human/WHjJ4qR2R2.svg',
  likes: [],
  comments: [],
  id: 'tqR33EXsyZ0',
  uuid: 'eadb35ef-605e-469a-b672-f70e2a1f801a',
  source: 'pgl34JtnfhX',
  amount: 49492,
  description: 'Payment: WHjJ4qR2R2 to uBmeaz5pX',
  privacyLevel: 'public',
  receiverId: 'uBmeaz5pX',
  senderId: 'WHjJ4qR2R2',
  balanceAtCompletion: 37423,
  status: 'complete',
  requestStatus: '',
  requestResolvedAt: '2024-03-30T04:45:19.527Z',
  createdAt: '2023-08-28T18:54:26.148Z',
  modifiedAt: '2024-03-07T20:38:11.078Z',
};

export const createPostTransactionPayload = (activeUserId: string, testNote: string): PostTransactionPayload => ({
  amount: '1',
  description: testNote,
  receiverId: randomlyChosenUser({ excludeUserId: activeUserId }).id,
  senderId: activeUserId,
  transactionType: 'payment',
});
