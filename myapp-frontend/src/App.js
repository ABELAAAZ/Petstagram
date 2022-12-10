
import './App.css';
import React,{Suspense} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Users from './user/pages/Users';
import NewPost from './posts/pages/NewPost';
import UpdatePost from './posts/pages/UpdatePost';
import UserPosts from './posts/pages/UserPosts';
import Trends from './posts/pages/Trends';
// import SearchForm from './posts/pages/SearchForm';
import PostDetail from './posts/pages/PostDetail';

import Auth from './user/pages/Auth';
import MainNavigation from './share/components/Navigation/MainNavigation';
import { AuthContext } from './share/context/auth-context';
import { useAuth } from './share/hooks/auth-hook';
import LoadingSpinner from './share/components/UIElements/LoadingSpinner';

const App = () => {
  const { token, login, logout, userId } = useAuth();
  let routes;
  if (token) {
    console.log('first,',token)
    routes = (
      <Switch>
        <Route path="/" exact>
          <Trends />
        </Route>
        <Route path="/:userId/following" exact>
          <Users />
        </Route>
        <Route path="/:userId/posts" exact>
          <UserPosts />
        </Route>
        <Route path="/posts/new" exact>
          <NewPost />
        </Route>
        <Route path="/posts/:postId" exact>
          <PostDetail />
        </Route>

        <Route path="/posts/:postId/update" exact>
          <UpdatePost />
        </Route>

        <Redirect to="/" />
      </Switch>
    );

  } else {
    console.log('second,',token)
    routes = (
      <Switch>
        <Route path="/" exact>
          <Trends />
        </Route>
        <Route path="/auth ">
          <Auth />
        </Route>
        <Redirect to="/auth " />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense fallback={<div className='center'><LoadingSpinner /></div>}>{routes}</Suspense></main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
