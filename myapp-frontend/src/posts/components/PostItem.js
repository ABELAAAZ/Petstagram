import React, { useContext } from 'react';
import Card from '../../share/components/UIElements/Card';
import './PostItem.css';
import { Link } from 'react-router-dom';
import { useHttpClient } from '../../share/hooks/http-hook';
import Button from '../../share/components/FormElements/Button';
import { AuthContext } from '../../share/context/auth-context';
import ErrorModal from '../../share/components/UIElements/ErrorModal';

const PostItem = props => {
    const auth = useContext(AuthContext);
    const { error, clearError } = useHttpClient();

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />


            <li className='post-item'>
                <Card className="post-item__content">
                    <div className='post-item__image'>
                        <img src={`${props.image}`} alt={props.title} />
                    </div>
                    <div className='post-item__info'>
                        <h2>{props.title}</h2>
                        <p>{props.description}</p>
                    </div>
                    <div className='post-item__actions'>
                        {auth.isLoggedIn && (<Link to={`/posts/${props.id}`}><Button>DETAIL</Button></Link>)}

                    </div>

                </Card>
            </li>
        </React.Fragment>
    );


}
export default PostItem;