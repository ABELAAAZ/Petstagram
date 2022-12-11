import React, { useEffect, useState, useContext} from 'react';
import UsersList from '../components/UsersList';
import {useParams} from "react-router-dom";
import {AuthContext} from "../../share/context/auth-context";
import { useHttpClient } from '../../share/hooks/http-hook';
import ErrorModal from '../../share/components/UIElements/ErrorModal';
import LoadingSpinner from '../../share/components/UIElements/LoadingSpinner';
// import "bootstrap/dist/css/bootstrap.min.css";


const Users = () => {
    const auth = useContext(AuthContext);
    const [loadedUsers, setLoadedUsers] = useState();
    const {isLoading,error,sendRequest,clearError} =useHttpClient();

    const userId = useParams().userId;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:4000/api/users/user/${userId}`,'GET', null, { Authorization: 'Bearer ' + auth.token }
                );
                setLoadedUsers(responseData.user);
            } catch (err) {         
            } 
        };
        fetchUsers();
    }, [sendRequest]);

    const [inputText, setInputText] = useState("");
    let inputHandler = (e) => {
        //convert input text to lower case
        const lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    };
 
    return (
        <React.Fragment>
          <ErrorModal error={error} onClear={clearError} />
          {isLoading && (
            <div className="center">
              <LoadingSpinner />
            </div>
          )}
            <div className="container">
                <form className="form-inline">
                    <div className="row justify-content-md-center">
                        <div className="col-7 ">
                            <label htmlFor="exampleFormControlSelect1">Search by Username:</label>
                            <div className="input-group input-group-sm mb-3">
                                <input type="text" className="form-control" aria-label="Small"
                                       aria-describedby="inputGroup-sizing-sm"
                                       onChange={inputHandler}/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            {loadedUsers && <UsersList items={loadedUsers} input={inputText}/>}
        </React.Fragment>
      );
    };
export default Users;
