import React, { useEffect,useState ,useContext} from 'react';
import PostList from '../components/PostList';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../share/context/auth-context';
import { useHttpClient } from '../../share/hooks/http-hook';
import ErrorModal from '../../share/components/UIElements/ErrorModal';
import './UserPosts.css'
const UserPosts = () => {
  const auth = useContext(AuthContext);
  const [loadedPosts, setLoadedPosts] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:4000/api/posts/user/${userId}`,'GET', null, { Authorization: 'Bearer ' + auth.token }
        );
        setLoadedPosts(responseData.posts);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, userId]);

  const postDeletedHandler = deletedPostId => {
    setLoadedPosts(prevPosts =>
      prevPosts.filter(post => post.id !== deletedPostId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <h1 className='user-name'>{userId}</h1>
      
      {!isLoading && loadedPosts && (
        <PostList items={loadedPosts} onDeletePost={postDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPosts;
