import React from 'react';
import {Link,withRouter} from 'react-router-dom';
import {logout, isAuthenticated} from '../auth/index';

const isActive = (history,path) => {
 
    if(history.location.pathname === path) {
        return {color: "#ff9900"};
    }
    else{
        return {color: "#ffffff"}
    }
};

const Menu = (props) => (
    <div>
        <ul className="nav nav-tabs justify-content-end bg-primary">
            
            {!isAuthenticated() && (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(props.history, "/signup")} to="/signup">Sign Up</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(props.history, "/signin")} to="/signin">Log In</Link>
                    </li>
                </>
            )}

            {isAuthenticated() && (
                <>
                      
                    {/* <li className="nav-item">
                        <Link className="nav-link" style={isActive(props.history, "/users")} to="/users">Users</Link>
                    </li> */}
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(props.history, "/")} to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        
                        <Link 
                            to={`/findpeople`} 
                            style={isActive(props.history, `/findpeople`) , {textDecoration: "none"}} 
                            className="nav-link"
                        >
                            Find People
                        </Link>
                        
                    </li>
                    <li className="nav-item">
                        
                        <Link 
                            to={`/post/create`} 
                            style={isActive(props.history, `/post/create`) , {textDecoration: "none"}} 
                            className="nav-link"
                        >
                            Create Post
                        </Link>
                        
                    </li>
                    <li className="nav-item">
                        
                        <Link 
                            to={`/users/${isAuthenticated().data.user._id}`} 
                            style={isActive(props.history, `/users/${isAuthenticated().data.user._id}`) , {textDecoration: "none"}} 
                            className="nav-link"
                        >
                            {isAuthenticated().data.user.name}
                        </Link>
                        
                    </li>
                    <li className="nav-item">
                        <span 
                            className="nav-link" 
                            style={isActive(props.history, "/signin") , {cursor: "pointer", color: "#fff"}} 
                            onClick={() => logout(() => props.history.push('/'))}
                        >
                            Log Out
                        </span>
                    </li>
                </>
            )}
            
        </ul>
    </div>
);

export default withRouter(Menu);

