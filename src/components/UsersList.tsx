import React from "react";
import { List } from "@material-ui/core";

import UserListItem from "./UserListItem";
import { User } from "../models";

export interface UsersListProps {
  users: User[];
  setReceiver: Function;
}

const UsersList: React.FC<UsersListProps> = ({ users, setReceiver }) => {
  return (
    <List>
      {users &&
        users.map((user: User, index: number) => (
          <UserListItem key={user.id} user={user} setReceiver={setReceiver} index={index} />
        ))}
    </List>
  );
};

export default UsersList;
