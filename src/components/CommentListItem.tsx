import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";

import { Comment } from "../models";

export interface CommentListItemProps {
  comment: Comment;
}

const CommentListItem: React.FC<CommentListItemProps> = ({ comment }) => {
  return (
    <ListItem data-test={`comment-list-item-${comment.id}`} data-testid={'comment-list-item'}>
      <ListItemText primary={`${comment.content}`} />
    </ListItem>
  );
};

export default CommentListItem;
