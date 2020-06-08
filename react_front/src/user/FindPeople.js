import React, {Component} from 'react';
import {findPeople} from './apiUser';
import {isAuthenticated} from '../auth/index';
import defaultProfile_Pic from '../images/avatar.jpg';
import {Link} from 'react-router-dom';

class FindPeople extends Component {

    constructor(){
        super();

        this.state= {
            users: []
        }
    }

    // getphotoURL = (userId) => {
    //     get_user_photo(userId)
    //     .then((data) => {
    //         // console.log(data);
    //         if(data){
    //             this.setState({photoURL: data.photo});
    //             console.log('Required url: ', this.state.photoURL);
    //         }  
    //     });   
    // };

    componentDidMount(){
        const userId = isAuthenticated().data.user._id;
        const token = isAuthenticated().token;
        findPeople(userId, token).then(data=> {
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
                 {user.photo ?  
                    <img 
                        className="card-img-top" 
                        src={`http://localhost:8080/${user.photo}`} alt={user.name} 
                        style={{width: '100%', height: '15vw', objectFit: 'cover'}} 
                    />
                    : 
                    <img 
                        className="card-img-top" 
                        src={defaultProfile_Pic} alt={user.name} 
                        style={{width: '100%', height: '15vw', objectFit: 'cover'}} 
                    />
                } 
                 
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
        // console.log('All users are: ', users)
        // let newUsers = [];
        // users.map((user) => {
        //     this.getphotoURL(user._id);
        //     let url = this.state.photoURL ? `http://localhost:8080/${this.state.photoURL}` : defaultProfile_Pic;
        //     let new_user = Object.assign({}, user, {"url": url});
        //     newUsers.push(new_user);
        // });

        // console.log('New users: ', newUsers);

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Users</h2>

                {this.renderUsers(users)}
            </div>
        );
    }
}

export default FindPeople;