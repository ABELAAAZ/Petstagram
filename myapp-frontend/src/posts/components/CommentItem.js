import React, { useContext } from 'react';
import { useHistory,Redirect,Link } from 'react-router-dom';

import { useHttpClient } from '../../share/hooks/http-hook';
import { AuthContext } from '../../share/context/auth-context';
import ErrorModal from '../../share/components/UIElements/ErrorModal';
import Button from '../../share/components/FormElements/Button';
import './PostDetailContentComment.css';

const CommentItem = props => {
    const comment = props.item;
    const auth = useContext(AuthContext);
    //const navigate=useNavigate()
    const history = useHistory({forceRefresh: true});
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const confirmDeleteHandler = async () => {
        try {
            await sendRequest(`http://localhost:4000/api/comments/${props.postId}/${comment.id}`, 'DELETE',
                null, { Authorization: 'Bearer ' + auth.token });
            history.push(`/${auth.userId}/posts`,{ update: true });
           //window.location.reload();
        } catch (err) { }

    };


    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />

            <li className='comment-item'>
                <div className='comment-title'>
                    <Link to={`/${comment.creator}/posts`}>
                        <div className='comment-name'>{comment.creator}</div>
                    </Link>
                    <div className='comment-time'> {comment.dateCreated} </div>
                    {auth.isLoggedIn && comment.creator === auth.userId &&
                        <Button danger onClick={confirmDeleteHandler}>Delete</Button>}</div>
                <div className='comment-content'>{comment.content} </div>
            </li>
        </React.Fragment>
    );


}
export default CommentItem;