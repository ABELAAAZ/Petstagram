import React, { useContext } from "react";
import { format } from "date-fns";
import { useHistory } from "react-router-dom";
import { useHttpClient } from "../../share/hooks/http-hook";
import Card from "../../share/components/UIElements/Card";

import { AuthContext } from "../../share/context/auth-context";
import "./PostDetailContentComment.css";
import CommentItem from "./CommentItem";

const CommentList = (props) => {
  const comments = props.item;
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const history = useHistory();

  if (comments.length === 0) {
    return (
      <Card>
        <h2>No comment</h2>
      </Card>
    );
  }

  return (
    <React.Fragment>
      <ul className="post-list">
        {comments.map((comment) => (
          <CommentItem
            postId={props.postId}
            item={comment}
            creator={comment.creator}
            delete={props.delete}
          />
        ))}
      </ul>
    </React.Fragment>
  );
};

export default CommentList;
