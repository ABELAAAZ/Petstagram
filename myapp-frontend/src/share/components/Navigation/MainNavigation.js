import React, {  useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import './MainNavigation.css';


const MainNavigation = props => {
    const auth = useContext(AuthContext);
    console.log(auth)
    //const responseData = await sendRequest(`http://localhost:4000/api/users`);


    return (
        <React.Fragment>

            <header className='main-header'>

                <h1 className='main-navigation__title'>
                    <Link to="/">Petstagram</Link>
                </h1>

                <nav className="main-navigation__header-nav">
                    <ul className='nav-links'>
                        <li>
                            <NavLink to="/" exact> Trending</NavLink>
                        </li>
                        {auth.isLoggedIn && (<li>
                            <NavLink to="/" exact> Following</NavLink>
                        </li>)}

                        {auth.isLoggedIn && (<li>
                            <NavLink to="/posts/new">New Post</NavLink>
                        </li>)}
                        {auth.isLoggedIn && (
                            <li>
                                <NavLink to={`/${auth.userId}/posts`}>
                                    {auth.userId}
                                </NavLink>
                            </li>

                        )}


                        {!auth.isLoggedIn && (<li>
                            <NavLink to="/auth"> Authenticate</NavLink>
                        </li>)}

                        {auth.isLoggedIn && (<li>
                            <button onClick={auth.logout}>Logout</button>
                        </li>)}

                    </ul>
                </nav>
            </header>
        </React.Fragment>
    );

};


export default MainNavigation;