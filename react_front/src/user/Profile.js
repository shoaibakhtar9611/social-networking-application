import React,{Component} from 'react';
import {isAuthenticated} from '../auth/index';
import {Redirect, Link} from 'react-router-dom';
import {get_user, get_user_photo} from './apiUser';
import defaultProfile_Pic from '../images/avatar.jpg';
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';
import {postByUser} from '../post/apiPost';
// import { postsByUser } from '../../../node_api/controllers/postController';

class Profile extends Component {

    constructor() {
        super();
        this.state = {
            user: {following: [], followers: []},
            redirectToSignin: false,
            following: false,
            photoURL: "",
            error: "",
            posts: []
        };
    }

    // Check whether to follow or unfollow
    checkFollow = (user) => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            return follower._id === jwt.data.user._id;
        });

        return match;
    };

    clickFollowButton = (callApi) => {
        const userId = isAuthenticated().data.user._id;
        const token = isAuthenticated().token;

        callApi(userId, token, this.state.user._id)     // `this.state.user._id` is the user to be followed or unfollowed
        .then(data => {
            if(data.error) {
                this.setState({error: data.error});
            }
            else {
                this.setState({user: data, following: !this.state.following});
            }
        })
    };

    loadPosts = (userId) => {
        const token = isAuthenticated().token;
        postByUser(userId, token).then(data => {
            if(data.error) {
                console.log(data.error);
            }
            else {
                this.setState({posts: data});
            }
        })
    };

    init = (userId) => {
        const token = isAuthenticated().token;
        get_user(userId, token).then(data => {
            if(data.error) {
                this.setState({redirectToSignin: true});
            }
            else {
                let following = this.checkFollow(data.data.user);
                this.setState({ user: data.data.user, following});
                this.loadPosts(data.data.user._id);
            }
        });
    };

    getphotoURL = (userId) => {
        get_user_photo(userId)
        .then((data) => {
            if(data){
                this.setState({photoURL: data.photo});
            }  
        });   
    };

    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId);
        this.getphotoURL(userId);
    }

    UNSAFE_componentWillReceiveProps(props) {       // Need to changed later, not safe to use
        const userId = props.match.params.userId;
        this.init(userId);
    }

    render() {
        if(this.state.redirectToSignin) {
            return <Redirect to="/signin" />
        }

        const url = this.state.photoURL ? `http://localhost:8080/${this.state.photoURL}` : defaultProfile_Pic;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Profile</h2>
                <div className="row">

                    <div className="col-md-4">
                        <img 
                            src={url}  alt={this.state.user.name} 
                            className="img-thumbnail mb-2"
                            style={{height: "200px", width: "auto"}} 
                        />
                    </div>

                    <div className="col-md-8">
                        <div className="lead mt-2">
                            <p>{this.state.user.name} </p>
                            <p>Email: {this.state.user.email}</p>
                            <p>{`Joined ${new Date(this.state.user.created).toDateString()}`}</p>
                        </div>
                        {isAuthenticated().data.user && isAuthenticated().data.user._id === this.state.user._id ? 
                            (
                                <div className="d-inline-block">
                                    <Link 
                                        className="btn btn-raised btn-info btn-sm mr-5" 
                                        to={`/post/create`}
                                    >
                                        Create Post
                                    </Link>
                                    <Link 
                                        className="btn btn-raised btn-success btn-sm mr-5" 
                                        to={`/users/edit/${this.state.user._id}`}
                                    >
                                        Edit Profile
                                    </Link>
                                    <DeleteUser userId={this.state.user._id}/>
                                </div>
                            ) : 
                            (   <FollowProfileButton 
                                    following={this.state.following}
                                    onButtonClick={this.clickFollowButton}
                                /> 
                            )
                        }
                        <hr/>
                        <ProfileTabs 
                            userId={this.state.user._id}
                            followers={this.state.user.followers}
                            following={this.state.user.following}
                            posts={this.state.posts}
                        />
                    </div>
                </div>
            </div>
        );
    }
};

export default Profile;
