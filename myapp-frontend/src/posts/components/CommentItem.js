import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from 'moment';
import { useHttpClient } from "../../share/hooks/http-hook";
import { AuthContext } from "../../share/context/auth-context";
import ErrorModal from "../../share/components/UIElements/ErrorModal";
import Button from "../../share/components/FormElements/Button";
import "./PostDetailContentComment.css";

const CommentItem = (props) => {
  const comment = props.item;
  const creator = props.creator;
  const auth = useContext(AuthContext);
  
  const {error, sendRequest, clearError } = useHttpClient();
  const [commentUserName, setcommentUserName] = useState();

  const confirmDeleteHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/comments/${props.postId}/${comment.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      await props.delete()
      //window.location.reload();
    } catch (err) {}
  };

  useEffect(() => {
    const getUserName = async () => {
      try {
        const commentUser = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${creator}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        setcommentUserName(commentUser.user.name);
      } catch (err) {}
    };
    getUserName();
  }, [sendRequest, creator,auth.token]);

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
          <div className="comment-time"> {moment(comment.dateCreated).format('h:mm A DD/MM/YYYY')} </div>
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
