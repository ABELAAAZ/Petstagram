import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../share/hooks/http-hook';
import { AuthContext } from '../../share/context/auth-context';
import ErrorModal from '../../share/components/UIElements/ErrorModal';
import LoadingSpinner from '../../share/components/UIElements/LoadingSpinner';
import PostDetailContent from '../components/PostDetailContent';
import PostDetailComment from '../components/PostDetailComment';
import './PostDetail.css'


const PostDetail = () => {
    const [loadedPosts, setLoadedPosts] = useState();
    const postId = useParams().postId;
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:4000/api/posts/${postId}`);
                console.log('resopnse,',{ responseData })
                setLoadedPosts(responseData.post);

            } catch (err) { };
        };
        fetchPosts();
    }, [sendRequest, postId])


    if (isLoading) {
        return (
            <div className='center'>
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
            <h1 className='user-name'>{auth.userId}</h1>
            <div className='main-content'>
            {!isLoading && loadedPosts && <PostDetailContent item={loadedPosts} />}
            {!isLoading && loadedPosts && <PostDetailComment item={loadedPosts.comments} />}
            </div>
        </React.Fragment >
    );


}
export default PostDetail;