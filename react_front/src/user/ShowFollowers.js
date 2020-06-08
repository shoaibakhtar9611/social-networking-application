import React from 'react';
import defaultProfile_Pic from '../images/avatar.jpg';
import {Link} from 'react-router-dom';


const ShowFollowers = (props) => {
    const followers = props.location.state.allFollowers;
    // console.log(followers);

    return (
        <div className="container">
            <h4 className="text-primary mt-5 mb-5">Followers</h4> 
           
            {followers.map((user,i) => 
                <>
                    <div key={i} className="d-inline block">
                        <img 
                            className="float-left mr-4"
                            style={{ height: "50px", width: "50px", borderRadius: "50%", border: "1px solid black"}}
                            src={defaultProfile_Pic}
                            alt={user.name}
                        />
                        <Link to={`/users/${user._id}`} style={{color: 'black' ,textDecoration: "none"}}>
                            <p className="lead">{user.name}</p>
                        </Link>
                    </div> 
                    <hr/> 
               </>
                
            )}
        </div>
    );
};

export default ShowFollowers;