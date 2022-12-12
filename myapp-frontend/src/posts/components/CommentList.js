import React from "react";
import Card from "../../share/components/UIElements/Card";
import "./PostDetailContentComment.css";
import CommentItem from "./CommentItem";

const CommentList = (props) => {
  const comments = props.item;
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
