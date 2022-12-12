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
  const [userFollowing, setUserFollowing] = useState();
  const [loadedUser, setLoadedUser] = useState();
  const [flag, setFlag] = useState(false);
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

        const responsePostCreator = await sendRequest(
          `http://localhost:4000/api/users/${responseData.post.creator}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        setLoadedUser(responsePostCreator.user);
        console.log(responsePostCreator.user);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, postId,flag]);

  const [formState, inputHandler] = useForm(
    {
      comment: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const history = useHistory({ forceRefresh: true });
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
      flag===true? setFlag(false) : setFlag(true)
    
    } catch (err) {}
  };

  const userFollowingHandler = async (event) => {
    event.preventDefault();
    try {
      const following = await sendRequest(
        `http://localhost:4000/api/users/${auth.userId}/follow/${loadedUser._id}`,
        "PATCH",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      setUserFollowing(following);

      // update loadedPosts.user.follower.includes(auth.userId) status
      const responseData = await sendRequest(
        `http://localhost:4000/api/posts/${postId}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      const responsePostCreator = await sendRequest(
        `http://localhost:4000/api/users/${responseData.post.creator}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      setLoadedUser(responsePostCreator.user);
    } catch (err) {}
  };

  const controlCommentHandler = async (event) => {
    flag===true? setFlag(false) : setFlag(true)
  }


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
      {loadedUser && (
        <h1 className="user-name">
          {loadedUser.name}{" "}
          {auth.userId !== loadedUser._id && (
            <Button follow onClick={userFollowingHandler}>
              {(userFollowing && userFollowing.isFollowed) ||
              loadedUser.follower.includes(auth.userId)
                ? "Following"
                : "Follow"}
            </Button>
          )}
        </h1>
      )}

      <div className="main-content">
        {!isLoading && loadedPosts && loadedUser && (
          <PostDetailContent item={loadedPosts} user={loadedUser} />
        )}

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
            <CommentList postId={postId} item={loadedComments} delete={controlCommentHandler}/>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
export default PostDetail;
