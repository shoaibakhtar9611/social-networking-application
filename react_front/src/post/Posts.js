import React, {Component} from 'react';
import {list_posts} from './apiPost';
import {isAuthenticated} from '../auth/index';
import defaultPost from '../images/defaultPost.png';
import {Link} from 'react-router-dom';

class Users extends Component {

    constructor(){
        super();

        this.state= {
            posts: []
        }
    }

    // getphotoURL = (userId) => {
    //     get_user_photo(userId)
    //     .then((data) => {
    //         if(data.error){
    //             this.setState({error: data.error});
    //         }
    //         else {
    //             this.setState({photoURL: data});
    //         }  
    //     });   
    // };

    componentDidMount(){
        const token = isAuthenticated().token;
        list_posts(token).then(data=> {
            if(data.error) {
                console.log(data.error);
            }
            else{
                this.setState({posts: data})
            }
        });
    }

    renderPosts = (posts) => {
        return (
            <div className="row">
                {posts.map((post,i) => {
                    const posterId = post.postedBy ? `/users/${post.postedBy._id}` : "";
                    const posterName = post.postedBy ? post.postedBy.name : "Unknown";
                    
                    return (
                        <div className="card col-md-3" key={i}>
                            <div className="card-body">
                                {post.photo ?  
                                    <img 
                                        className="img-thumbnail mb-3" 
                                        src={`http://localhost:8080/${post.photo}`} alt={post.title} 
                                        style={{width: '100%', height: '200px'}} 
                                    />
                                    : 
                                    <img 
                                        className="img-thumbnail mb-3" 
                                        src={defaultPost} alt={post.title} 
                                        style={{width: '100%', height: '200px'}}                                     
                                    />
                                } 
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{post.body.substring(0,50)}</p>
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
                                <Link className="btn btn-raised btn-primary btn-sm" to={`post/${post._id}`}>Read More</Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        );
        
    };


    render() {
        const {posts} = this.state;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Recent Posts</h2>

                {this.renderPosts(posts)}
            </div>
        );
    }
}

export default Users;