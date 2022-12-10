import React, { useEffect,useState ,useContext, useMemo} from 'react';
import PostList from '../components/PostList';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../share/context/auth-context';
import { useHttpClient } from '../../share/hooks/http-hook';
import ErrorModal from '../../share/components/UIElements/ErrorModal';
import './UserPosts.css'
// import "bootstrap/dist/css/bootstrap.min.css";


const UserPosts = () => {
    const auth = useContext(AuthContext);
    const [loadedPosts, setLoadedPosts] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const userId = useParams().userId;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:4000/api/posts`,'GET', null, { Authorization: 'Bearer ' + auth.token }
                );
                setLoadedPosts(responseData.post);
            } catch (err) {}
        };
        fetchPosts();
    }, [sendRequest, userId]);

    const postDeletedHandler = deletedPostId => {
        setLoadedPosts(prevPosts =>
            prevPosts.filter(post => post.id !== deletedPostId)
        );
    };

    const [sort, setSort] = useState('date');
    const [order, setOrder] = useState('');

    const handleSort = event => {
        setSort(event.target.value);
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <div className="container">
                <form className="form-inline">
                    <div className="row justify-content-md-center">
                        <div className="col-7">
                            <div className="form-group">
                                <label htmlFor="exampleFormControlSelect1">Sort by:</label>
                                <select className="form-control form-control-sm" onChange={handleSort}>
                                    <option  value="date">Date</option>
                                    <option  value="title">Title</option>
                                    <option  value="comments">Comments</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-md-center">
                        <div className="col-7">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                                       id="inlineRadio1" value="ascending"
                                       onChange={e => {
                                           setOrder(e.target.value)
                                       }}/>
                                <label className="form-check-label" htmlFor="inlineRadio1">Ascending</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                                       id="inlineRadio2" value="descending"
                                       onChange={e => {
                                           setOrder(e.target.value)
                                       }}/>
                                <label className="form-check-label" htmlFor="inlineRadio2">Descending</label>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            {!isLoading && loadedPosts && (
                <PostList items={loadedPosts} sort = {sort} order = {order} onDeletePost={postDeletedHandler} />
            )}
        </React.Fragment>
    );
};

export default UserPosts;
