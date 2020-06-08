import React from 'react';
import defaultProfile_Pic from '../images/avatar.jpg';
import {Link} from 'react-router-dom';


const ShowFollowing = (props) => {
    const following = props.location.state.allFollowing;

    return (
        <div className="container">
            <h4 className="text-primary mt-5 mb-5">Following</h4> 
           
            {following.map((user,i) => 
                <>
                    
                    <div className="d-inline block mb-2">
                        <img 
                            className="float-left mr-4"
                            style={{ height: "50px", width: "50px", borderRadius: "50%", border: "1px solid black"}}
                            src={defaultProfile_Pic}
                            alt={user.name}
                        />
                        <Link to={`/users/${user._id}`} style={{color: 'black' ,textDecoration: "none"}}>
                            <p className="lead">{user.name}</p>
                        </Link>
                        <hr/> 
                    </div> 
               </>
                
            )}
        </div>
    );
};

export default ShowFollowing;