import React, { useEffect, useState, useContext } from "react";
import PostList from "../components/PostList";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../share/context/auth-context";
import { useHttpClient } from "../../share/hooks/http-hook";
import ErrorModal from "../../share/components/UIElements/ErrorModal";
import Button from "../../share/components/FormElements/Button";
import "./UserPosts.css";
const UserPosts = () => {
  const auth = useContext(AuthContext);
  const [loadedPosts, setLoadedPosts] = useState();
  const [userFollowing, setUserFollowing] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:4000/api/posts/user/${userId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        setLoadedPosts(responseData);
        console.log(
          "AuthUser: ",
          responseData.user.follower.includes(auth.userId)
        );
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, userId]);

  const postDeletedHandler = (deletedPostId) => {
    setLoadedPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== deletedPostId)
    );
  };

  const userFollowingHandler = async (event) => {
    event.preventDefault();
    try {
      const following = await sendRequest(
        `http://localhost:4000/api/users/${auth.userId}/follow/${userId}`,
        "PATCH",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      setUserFollowing(following);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      {!isLoading && loadedPosts && (
        <div>
          <h1 className="user-name">
            {loadedPosts.user.name}{" "}
            {auth.userId !== userId && (
              <Button follow onClick={userFollowingHandler}>
                {(userFollowing && userFollowing.isFollowed) ||
                loadedPosts.user.follower.includes(auth.userId)
                  ? "Following"
                  : "Follow"}
              </Button>
            )}
          </h1>
          <PostList
            items={loadedPosts.posts}
            onDeletePost={postDeletedHandler}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default UserPosts;
