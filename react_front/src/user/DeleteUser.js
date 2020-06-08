import React, {Component} from 'react';
import {isAuthenticated} from '../auth/index';
import {remove_user} from './apiUser';
import {logout} from '../auth/index';
import { Redirect } from 'react-router-dom';

class DeleteUser extends Component {

    state = {
        redirect: false
    };

    deleteAccount = () => {
        const token = isAuthenticated().token;
        const userId = this.props.userId;
        remove_user(userId,token)
        .then(data => {
            if(data.error) {
                console.log(data.error);
            }
            else {
                // Logout the user
                logout(() => console.log('Account deleted succesfully..'));

                // Redirect 
                this.setState({redirect: true});
            }
        })
    }

    deleteConfirmed = () => {
        let answer = window.confirm('Are you sure you want to delete your account?');
        if(answer) {
            this.deleteAccount();
        }
    }

    render() {
        if(this.state.redirect) {
            return <Redirect to="/" />
        }
        return (
            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger btn-sm">
                Delete Profile
            </button>
        );
    }
}

export default DeleteUser;