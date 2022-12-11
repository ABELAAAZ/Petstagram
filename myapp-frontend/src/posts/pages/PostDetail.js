import React, { useContext, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useHttpClient } from "../../share/hooks/http-hook";
import { AuthContext } from "../../share/context/auth-context";
import ErrorModal from "../../share/components/UIElements/ErrorModal";
import LoadingSpinner from "../../share/components/UIElements/LoadingSpinner";
import PostDetailContent from "../components/PostDetailContent";
import CommentList from "../components/CommentList";
import "./PostDetail.css";
import Input from "../../share/components/FormElements/Input";
import Button from "../../share/components/FormElements/Button";
import { useForm } from "../../share/hooks/form-hooks";
import { VALIDATOR_MINLENGTH } from "../../share/util/validators";

const PostDetail = () => {
  const [loadedPosts, setLoadedPosts] = useState();
  const [loadedComments, setLoadedComments] = useState();
  const postId = useParams().postId;
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:4000/api/posts/${postId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        const responseComments = await sendRequest(
          `http://localhost:4000/api/comments/${postId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        setLoadedPosts(responseData.post);
        setLoadedComments(responseComments.comments);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, postId]);

  const [formState, inputHandler] = useForm(
    {
      comment: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const commentSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:4000/api/posts/${postId}/comment`,
        "POST",
        JSON.stringify({
          comment: formState.inputs.comment.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push(`/${auth.userId}/posts`, { update: true });
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <h1 className="user-name">{auth.userName}</h1>

      <div className="main-content">
        {!isLoading && loadedPosts && <PostDetailContent item={loadedPosts} />}

        <div className="center">
          <form className="comment-form" onSubmit={commentSubmitHandler}>
            {isLoading && <LoadingSpinner asOverlay />}
            <Input
              id="comment"
              element="input"
              type="text"
              placeholder="leave your comment"
              validators={[VALIDATOR_MINLENGTH(2)]}
              errorText="comment at least two characters."
              onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
              SUBMIT
            </Button>
          </form>
        </div>

        <div className="center">
          {!isLoading && loadedPosts && (
            <CommentList postId={postId} item={loadedComments} />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
export default PostDetail;
