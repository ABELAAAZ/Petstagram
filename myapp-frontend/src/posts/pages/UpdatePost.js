import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import Input from "../../share/components/FormElements/Input";
import { useForm } from "../../share/hooks/form-hooks";
import Card from "../../share/components/UIElements/Card";
import Button from "../../share/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../share/util/validators";
import ErrorModal from "../../share/components/UIElements/ErrorModal";
import LoadingSpinner from "../../share/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../share/hooks/http-hook";
import { AuthContext } from "../../share/context/auth-context";
import "./PostForm.css";

const UpdatePost = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPosts, setLoadedPosts] = useState();
  const postId = useParams().postId;
  const history = useHistory();
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:4000/api/posts/${postId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        // console.log({ responseData })
        setLoadedPosts(responseData.post);

        setFormData(
          {
            title: {
              value: responseData.post.title,
              isValid: true,
            },
            description: {
              value: responseData.post.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, postId, setFormData]);

  const postUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:4000/api/posts/${postId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push(`/posts/${postId}`);
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPosts && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find the post</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      {!isLoading && loadedPosts && (
        <form className="place-form" onSubmit={postUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title name"
            onInput={inputHandler}
            initialValue={loadedPosts.title}
            initialValid={true}
          />

          <Input
            id="description"
            element="textarea"
            label="description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description at least 5 characters"
            onInput={inputHandler}
            initialValue={loadedPosts.description}
            initialValid={true}
          />

          <Button type="submit" disabled={!formState.isValid}>
            UPDATE Post
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePost;
