import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class ProfileTabs extends Component {
    // this function is used to remove duplicate id's from the following array
    getUnique(arr, comp) {

        const unique = arr
            .map(e => e[comp])
      
           // store the keys of the unique objects
           .map((e, i, final) => final.indexOf(e) === i && i)
      
           // eliminate the dead keys & store unique objects
           .filter(e => arr[e]).map(e => arr[e]);
      
        return unique;
    };
      
    render() {
        let {userId, followers, following, posts} = this.props;

        following = this.getUnique(following, '_id');
        // console.log(following);

        return (
            <div className="row lead">
                <div className="col-md-4">
                    <Link 
                        to={{pathname: `/users/${userId}/followers`, state: { allFollowers: followers} }}
                        style={{textDecoration: "none"}}>
                        <span style={{color:'black'}}>{followers.length} </span> 
                        Followers
                    </Link>
                    
                    {/* <Link to={`/users/${userId}/followers`} style={{textDecoration: "none"}}>
                        <span style={{color:'black'}}>{followers.length} </span> 
                        Followers
                    </Link>  */}
                </div>
                <div className="col-md-4">
                    <Link 
                        to={{pathname: `/users/${userId}/following`, state: { allFollowing: following} }}
                        style={{textDecoration: "none"}}>
                        <span style={{color:'black'}}>{following.length} </span> 
                        Following
                    </Link>
                    {/* <Link to={`/users/${userId}/following`} style={{textDecoration: "none"}}>
                        <span style={{color:'black'}}>{following.length} </span> 
                        Following
                    </Link> */}
                </div>
                <div className="col-md-4">
                    <p className="lead"><span style={{color:'black'}}>{posts.length} </span> Posts</p>
                    {posts.map((post,i) => 
                        <>
                            <div key={i}>
                                <Link to={`/post/${post._id}`} style={{color: '#cc9900' ,textDecoration: "none"}}>
                                    <p className="lead">{post.title}</p>
                                </Link>
                            </div> 
                            <hr/> 
                        </>
                    )}
                </div>
            </div>
        );
    }
};

export default ProfileTabs;