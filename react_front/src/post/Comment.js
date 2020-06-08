import React, {Component} from 'react';
import {comment_post, uncomment_post} from './apiPost';
import {isAuthenticated} from '../auth/index';
import {Link,Redirect} from 'react-router-dom';
   
class Comment extends Component{

    state = {
        text: "",
        error: ""
    }

    handleChange = (event) => {
        this.setState({error: ''});
        this.setState({text: event.target.value});
    }

    isValid = () => {
        const {text} = this.state;
        if(!text.length > 0 || text.length > 150) {
            this.setState({error: 'Comments should not be empty and less than 150 characters..!!'});
            return false;
        }

        return true;
    }

    addComment = (event) => {
        event.preventDefault();

        if(this.isValid()) {
            const userId = isAuthenticated().data.user._id;
            const token = isAuthenticated().token;
            const postId = this.props.postId;
            const comment = {text: this.state.text}

            comment_post(userId, token, postId, comment).then(data => {
                if(data.error) {
                    console.log(data.error);
                }
                else {
                    this.props.updateComments(data.comments);
                }
            });
        }
    }

    deleteComment = (comment) => {
        const userId = isAuthenticated().data.user._id;
        const token = isAuthenticated().token;
        const postId = this.props.postId;
    
        uncomment_post(userId, token, postId, comment).then(data => {
            if(data.error) {
                console.log(data.error);
            }
            else {
                this.setState({text: ''});
                // Dispatch fresh list of comments to {SinglePost} component
                // console.log('Comments from comment page: ', data.comments);
                this.props.updateComments(data.comments);
            }
        });
    }

    deleteConfirmed = (comment) => {
        let answer = window.confirm('Are you sure you want to delete your comment?');
        if(answer) {
            this.deleteComment(comment);
        }
    }

    render() {
        // console.log(this.props.comments);
        const comments = this.props.comments;
        const postId = this.props.postId;
        const {error} = this.state;
        return (
            <div>
                <h5 className="mt-5 mb-4">Leave a Comment</h5>
                
                <form onSubmit={this.addComment}>
                    <div className="form-group">
                        <input 
                            className="form-control" 
                            type="text" 
                            value={this.state.text} 
                            onChange={this.handleChange} 
                            placeholder="Leave a comment..."
                        />
                        <button className="btn btn-raised btn-success btn-sm mt-2">Post</button>
                    </div>
                </form>

                <div className="alert alert-danger" style={{display: error ? "" : 'none'}}>{error}</div>

                <div>
                    <h5 className="text-primary"><span style={{color: 'black'}}>{comments.length} </span>Comments</h5>
                    <hr />
                    {comments.map((comment, i) => (
                        <div key={i}>
                            <div className="row">
                                <div className="col-md-1">
                                    <Link to={`/users/${comment.postedBy._id}`} style={{color: 'black' ,textDecoration: "none"}}>
                                        <p>{comment.postedBy.name}</p>
                                    </Link>
                                </div>
                                <div className="col-md-10">
                                    <p className="font-italic mark" style={{color: '#cc9900'}}>{comment.text}</p>
                                </div>
                                <div className="col-md-1">
                                    {isAuthenticated().data.user && isAuthenticated().data.user._id === comment.postedBy._id  && (
                                        <>
                                            <span
                                                onClick={() => this.deleteConfirmed(comment)} 
                                                className="font-italic text-danger"
                                            >
                                                Remove
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}; 

export default Comment;