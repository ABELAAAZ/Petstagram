
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, useHistory } from 'react-router-dom';
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


const App = () => {
  const { token, login, logout, userId, userName } = useAuth();
  const history = useHistory()
  let routes;
  
  
  if (token) {
    console.log("first,", token);
    routes = (
      <Switch>
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
        <Route path="/" exact>
          <Trends />
        </Route>
        <Redirect to='/' />
      </Switch>
    );
  } else {
    // console.log("second,", token);
    routes = (
      <Switch>

        <Route path="/auth " exact>
          <Auth />
        </Route>
        <Route path="/" exact>
          <Trends />
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
        userName: userName,
        login: login,
        logout: logout,
      }}
    >
      <Router history={history}>
        <MainNavigation />
        <main>

          {routes}

        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
