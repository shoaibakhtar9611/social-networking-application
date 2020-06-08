import React from 'react';
import {Route, Switch} from 'react-router-dom';
import PrivateRoute from './auth/PrivateRoute';
import Home from './core/Home';
import Menu from './core/Menu';
import SignUp from './user/SignUp';
import SignIn from './user/SignIn';
import Profile from './user/Profile';
import Users from './user/User';
import EditProfile from './user/EditProfile';
import FindPeople from './user/FindPeople';
import ShowFollowers from './user/ShowFollowers';
import ShowFollowing from './user/ShowFollowing';
import NewPost from './post/NewPost';
import SinglePost from './post/SinglePost';

const MainRouter = () => (
    <div>
        <Menu />
        <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute exact path="/users" component={Users} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/signin" component={SignIn} />
            <PrivateRoute exact path="/users/:userId" component={Profile} />
            <PrivateRoute exact path="/users/edit/:userId" component={EditProfile} />
            <PrivateRoute exact path="/findpeople" component={FindPeople} />
            <PrivateRoute exact path="/users/:userId/followers" component={ShowFollowers} />
            <PrivateRoute exact path="/users/:userId/following" component={ShowFollowing} />
            <PrivateRoute exact path="/post/create" component={NewPost} />
            <PrivateRoute exact path="/post/:postId" component={SinglePost} />
        </Switch>
    </div>
);

export default MainRouter;