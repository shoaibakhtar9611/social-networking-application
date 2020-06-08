import React, {Component} from 'react';
import {singlePost, remove_post, like_post, unlike_post} from './apiPost';
import {isAuthenticated} from '../auth/index';
import defaultPost from '../images/defaultPost.png';
import {Link, Redirect} from 'react-router-dom';
import MainRouter from '../MainRotuer';
import Comment from './Comment';
import 'font-awesome/css/font-awesome.min.css';

class SinglePost extends Component {

    state = {
        post: "",
        isFetched: false,
        deleted: false,
        like: false,
        likes: 0,
        comments: []
    }

    checkLike = (likes) => {
        const userId = isAuthenticated() && isAuthenticated().data.user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    }

    componentDidMount() {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        singlePost(postId, token).then(data => {
            if(data.error) {
                console.log(data.error);
            }
            else {
                this.setState({
                    post: data, 
                    isFetched: true, 
                    likes: data.likes.length,
                    like: this.checkLike(data.likes),
                    comments: data.comments
                });
            }
        });
    }

    updateComments = (comments) => {
        console.log('update Comments 47: ', comments);
        this.setState({comments});
    }

    likeToggle = () => {
        let callApi = this.state.like ? unlike_post : like_post;
        const userId = isAuthenticated().data.user._id;
        const token = isAuthenticated().token;
        const postId = this.state.post._id;

        callApi(userId, token, postId).then(data => {
            if(data.error) {
                console.log(data.error);
            }
            else {
                this.setState({like: !this.state.like, likes: data.likes.length});
            }
        })
    }

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        remove_post(postId, token).then(data => {
            if(data.error) {
                console.log(data.error);
            }
            else {
                this.setState({deleted: true});
            }
        });
    }

    deleteConfirmed = () => {
        let answer = window.confirm('Are you sure you want to delete this post?');
        if(answer) {
            this.deletePost();
        }
    }

    renderPost = (post) => {
        const posterId = post.postedBy ? `/users/${post.postedBy._id}` : "";
        const posterName = post.postedBy ? post.postedBy.name : "Unknown";

        const {like, likes} = this.state;
                    
        return (
            <div className="card-body">
                {post.photo ?  
                    <img 
                        className="img-thumbnail mb-3" 
                        src={`http://localhost:8080/${post.photo}`} alt={post.title} 
                        style={{width: '100%', height: '300px', objectFit: 'cover'}} 
                    />
                    : 
                    <img 
                        className="img-thumbnail mb-3" 
                        src={defaultPost} alt={post.title} 
                        style={{width: '100%', height: '300px', objectFit: 'cover'}}                                     
                    />
                } 

                {like ? (
                    <h4 onClick={this.likeToggle} className="mb-3">
                        <i className="fa fa-thumbs-up text-success bg-dark"
                            style={{padding: "8px", borderRadius: "50%"}}
                        ></i>{" "}
                        {likes} Likes
                    </h4>
                ) : (
                    <h4 onClick={this.likeToggle} className="mb-3">
                        <i className="fa fa-thumbs-up text-light bg-dark"
                            style={{padding: "8px", borderRadius: "50%"}}
                        ></i>{" "}
                        {likes} Likes
                    </h4>
                )}

                <p className="card-text">{post.body}</p>
                <br/>
                <p className="font-italic mark">
                    Posted by{" "} 
                    <Link to={posterId}>
                        {posterName}
                    </Link>
                </p>
                <p className="font-italic mark">
                    On {new Date(post.created).toDateString()}
                </p>
                <div className="d-inline-block">
                    <Link className="btn btn-raised btn-primary btn-sm mr-5" to={`/`}>Back to Home</Link>
                    
                    {isAuthenticated().data.user && isAuthenticated().data.user._id === post.postedBy._id  && (
                        <>
                            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger btn-sm">Delete</button>
                        </>
                    )}
                </div>
            </div>
        )
    }

    render() {
    
        if(this.state.deleted) {
            return <Redirect to={`/`} />
        }

        const {post, isFetched, comments} = this.state;
        
        
        return (
            <div className="container">
                { isFetched ? (
                    <>
                        <h3 className="display-2 mt-5 mb-5 lead">{post.title}</h3>
                        {this.renderPost(post)}
                        {console.log('Console from singlePost 164: ',comments)}
                        <Comment postId={post._id} comments={comments.reverse()} updateComments={this.updateComments}/>
                    </>
                    
                ):(
                    <div className="jumbotron text-center"><h3>Loading...</h3></div>
                )}

            </div>
        )
    }
}

export default SinglePost;
