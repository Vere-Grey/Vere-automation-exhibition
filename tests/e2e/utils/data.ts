import faker from '@faker-js/faker';
import seed from '../../../data/database.json';
import { DefaultPrivacyLevel, User } from '../../../src/models/user';

const userLookup: { [key: string]: User } = {};

type SeedUser = Omit<User, 'defaultPrivacyLevel' | 'createdAt' | 'modifiedAt'> & {
  defaultPrivacyLevel: string;
  createdAt: string;
  modifiedAt: string;
};

// Populate the lookup object
seed.users.forEach((user: SeedUser) => {
  const userWithCorrectType: User = {
    ...user,
    defaultPrivacyLevel: user.defaultPrivacyLevel as DefaultPrivacyLevel,
    createdAt: new Date(user.createdAt),
    modifiedAt: new Date(user.modifiedAt),
  };
  userLookup[userWithCorrectType.username] = userWithCorrectType;
});

export const users = userLookup;
export const userPassword = process.env.SEED_DEFAULT_USER_PASSWORD as string;
export const randomUserInput = () => {
  const password = faker.internet.password();
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
    password,
    confirmPassword: password,
  };
};
export const randomlyChosenUser = (args: { excludeUserId?: string } = {}) => {
  const usersArray = Object.values(users).filter(user => user.id !== args.excludeUserId);
  const randomUser = faker.random.arrayElement(usersArray);
  return randomUser;
};
