import React, { useContext, useState } from 'react';
import Card from '../../share/components/UIElements/Card';
import Input from '../../share/components/FormElements/Input';
import Button from '../../share/components/FormElements/Button';
import { useForm } from '../../share/hooks/form-hooks';
import ErrorModal from '../../share/components/UIElements/ErrorModal';
import LoadingSpinner from '../../share/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../share/hooks/http-hook';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../share/util/validators';
import ImageUpload from '../../share/components/FormElements/ImageUpload';

import './Auth.css';
import { AuthContext } from '../../share/context/auth-context';


const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            }
        },
        false
    );

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                    image: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: '',
                        isValid: false
                    },
                    image: {
                        value: null,
                        isValid: false
                    }
                },
                false
            );
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    const authSubmitHandler = async event => {
        event.preventDefault();
        if (isLoginMode) {
            try {
                const responseData = await sendRequest(`http://localhost:4000/api/users/login`, 'POST', JSON.stringify({

                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                }),
                    { 'Content-Type': 'application/json' });

                auth.login(responseData.userId,responseData.token);
            } catch (err) { }
        } else {
            try {
                const formData=new FormData();
                formData.append('email',formState.inputs.email.value);
                formData.append('name',formState.inputs.name.value);
                formData.append('password',formState.inputs.password.value);
                formData.append('image',formState.inputs.image.value);
                const responseData = await sendRequest(`http://localhost:4000/api/users/signup`, 'POST',formData );
                console.log(responseData);
                auth.login(responseData.userId,responseData.token);
            } catch (err) {
            }
        }
    };


    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Login Required</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                            element="input"
                            id="name"
                            type="text"
                            label="Your Name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a name."
                            onInput={inputHandler}
                        />
                    )}
                    {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText="Please upload a image"/>}

                    <Input
                        element="input"
                        id="email"
                        type="email"
                        label="E-Mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email address."
                        onInput={inputHandler}
                    />
                    <Input
                        element="input"
                        id="password"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password, at least 5 characters."
                        onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler}>
                    SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
                </Button>
            </Card>
        </React.Fragment>
    );
};

export default Auth;
