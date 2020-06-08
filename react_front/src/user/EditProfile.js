import React, {Component} from 'react';
import {isAuthenticated} from '../auth/index';
import defaultProfile_Pic from '../images/avatar.jpg';
import {get_user, update_user, updatedUser, get_user_photo} from './apiUser';
import { Redirect } from 'react-router-dom';

class EditProfile extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            name: "",
            email: "",
            password: "",
            redirectToProfile: false,
            error: "",
            fileSize: 0,
            photoURL:""
        };
    }

    init = (userId) => {
        const token = isAuthenticated().token;
        get_user(userId, token).then(data => {
            if(data.error) {
                this.setState({redirectToProfile: true});
            }
            else {
                this.setState({ 
                    id: data.data.user._id, 
                    name: data.data.user.name,
                    email: data.data.user.email, 
                    error: ''
                });
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
        this.userData = new FormData();
        const userId = this.props.match.params.userId;
        this.init(userId);
        this.getphotoURL(userId);
    }

    isValid = () => {
        const {name, email, password, fileSize} = this.state;

        if(fileSize > 100000) {
            this.setState({error: "File size should be less than 100kb..!!!"});
            return false;
        }

        if(name.length === 0) {
            this.setState({error: "Name is required..!!!"});
            return false;
        }

        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!re.test(email)) {
           this.setState({error: "Please provide a valid email..!!!"});
           return false;
        }

        if(password.length >= 1 && password.length <=7) {
            this.setState({error: "Password should contain atleast 8 characters..!!!"});
            return false;
        }

        return true;
    }

    handleChange = (field_name) => (event) => {
        this.setState({error: ""});
          
        const value = (field_name === 'photo') ? event.target.files[0] : event.target.value;
        const fileSize = (field_name === 'photo') ? event.target.files[0].size : 0;
        this.userData.set(field_name, value);
        this.setState({ [field_name]: value, fileSize });
    }; 

    clickSubmit = (event) => {
        event.preventDefault();

        if(this.isValid()) {
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;
        
            update_user(userId, token, this.userData).then(data => {
                if(data.error) {
                    console.log('Error generated is: ', data.error);
                    this.setState({ error: data.error});
                }
                else {
                    updatedUser(data.data.user, () => {
                        this.setState({ redirectToProfile: true });
                    }); 
                }
            });
        }
    };

    signupForm = (name, email, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Profile Photo</label>
                <input 
                    onChange={this.handleChange("photo")} 
                    type="file" 
                    accept="image/*"
                    className="form-control" 
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input 
                    onChange={this.handleChange("name")} 
                    type="text" 
                    className="form-control" 
                    value={name}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input 
                    onChange={this.handleChange("email")} 
                    type="email" 
                    className="form-control" 
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input 
                    onChange={this.handleChange("password")} 
                    type="password" 
                    className="form-control" 
                    value={this.state.password}
                />
            </div>
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Update</button>
        </form>
    );

    render() {

        if(this.state.redirectToProfile) {
            return <Redirect to={`/users/${this.state.id}`} />
        }

        const url = this.state.photoURL ? `http://localhost:8080/${this.state.photoURL}` : defaultProfile_Pic;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>

                <div className="alert alert-danger" style={{ display: this.state.error ? "" : "none"}}>
                    {this.state.error}
                </div>
              
                <img 
                    className="img-thumbnail mb-2"
                    style={{height: "200px", width: "auto"}} 
                    src={url} 
                    alt={this.state.name}
                />

                {this.signupForm(this.state.name, this.state.email, this.state.password)}
            </div>
        );
    }
}

export default EditProfile;