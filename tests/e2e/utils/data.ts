import seed from '../../../data/database-seed.json';
import { User } from '../../../src/models/user';


const userLookup: { [key: string]: User } = {};

// Populate the lookup object
seed.users.forEach((user: any) => {
  userLookup[user.username] = user;
});

export const users = userLookup;
export const userPassword = process.env.SEED_DEFAULT_USER_PASSWORD as string;