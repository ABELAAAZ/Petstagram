import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../share/components/FormElements/Input";
import Button from "../../share/components/FormElements/Button";
import { useForm } from "../../share/hooks/form-hooks";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../share/util/validators";
import { useHttpClient } from "../../share/hooks/http-hook";
import { AuthContext } from "../../share/context/auth-context";
import ErrorModal from "../../share/components/UIElements/ErrorModal";
import LoadingSpinner from "../../share/components/UIElements/LoadingSpinner";
import ImageUpload from "../../share/components/FormElements/ImageUpload";
import "./PostForm.css";
import CloudinaryUploadWidget from "../../share/components/FormElements/CloudinaryUploadWidget";

const NewPost = () => {
    console.log("enter new post");
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            description: {
                value: "",
                isValid: false,
            },
            address: {
                value: "",
                isValid: false,
            },
            image: {
                value: null,
                isValid: false,
            },
        },
        false
    );

    const history = useHistory();

  const postSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);
      console.log('frontend,formadata image',formState.inputs.image.value)
      await sendRequest(`http://localhost:4000/api/posts`, "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });
      history.push(`/${auth.userId}/posts`);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={postSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <ImageUpload
          center
          id="image"
          onInput={inputHandler}
          errorText="Please upload a image"
        />
        <Button type="submit" disabled={!formState.isValid}>
          SUBMIT
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPost;