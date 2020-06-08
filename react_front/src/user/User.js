import React, {Component} from 'react';
import {list_users} from './apiUser';
import defaultProfile_Pic from '../images/avatar.jpg';
import {Link} from 'react-router-dom';

class Users extends Component {

    constructor(){
        super();

        this.state= {
            users: []
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
        list_users().then(data=> {
            if(data.error) {
                console.log(data.error);
            }
            else{
                this.setState({users: data})
            }
        });
    }

    renderUsers = (users) => (
        <div className="row">
            {users.map((user,i) => ( 
                <div className="card col-md-3" key={i}>
                  <img 
                    className="card-img-top" 
                    src={defaultProfile_Pic} alt={user.name} 
                    style={{width: '100%', height: '15vw', objectFit: 'cover'}} 
                  />
                  <div className="card-body">
                    <h5 className="card-title">{user.name}</h5>
                    <Link className="btn btn-raised btn-primary btn-sm" to={`users/${user._id}`}>View Profile</Link>
                  </div>
                </div>
            ))}
        </div>
    );


    render() {
        const {users} = this.state;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Users</h2>

                {this.renderUsers(users)}
            </div>
        );
    }
}

export default Users;