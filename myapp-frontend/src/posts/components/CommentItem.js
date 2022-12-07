import React, { useContext, useState, useEffect } from "react";
import { useHistory, Redirect, Link } from "react-router-dom";

import { useHttpClient } from "../../share/hooks/http-hook";
import { AuthContext } from "../../share/context/auth-context";
import ErrorModal from "../../share/components/UIElements/ErrorModal";
import Button from "../../share/components/FormElements/Button";
import "./PostDetailContentComment.css";

const CommentItem = (props) => {
  const comment = props.item;
  const creator = props.creator;
  const auth = useContext(AuthContext);
  //const navigate=useNavigate()
  const history = useHistory({ forceRefresh: true });
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [commentUserName, setcommentUserName] = useState();

  const confirmDeleteHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:4000/api/comments/${props.postId}/${comment.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      history.push(`/${auth.userId}/posts`, { update: true });
      //window.location.reload();
    } catch (err) {}
  };

  useEffect(() => {
    const getUserName = async () => {
      try {
        const commentUser = await sendRequest(
          `http://localhost:4000/api/users/${creator}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        setcommentUserName(commentUser.user.name);
      } catch (err) {}
    };
    getUserName();
  }, [sendRequest, creator]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <li className="comment-item">
        <div className="comment-title">
          {commentUserName && (
            <Link to={`/${creator}/posts`}>
              <div className="comment-name">{commentUserName}</div>
            </Link>
          )}
          <div className="comment-time"> {comment.dateCreated} </div>
          {auth.isLoggedIn && comment.creator === auth.userId && (
            <Button danger onClick={confirmDeleteHandler}>
              Delete
            </Button>
          )}
        </div>
        <div className="comment-content">{comment.content} </div>
      </li>
    </React.Fragment>
  );
};
export default CommentItem;
