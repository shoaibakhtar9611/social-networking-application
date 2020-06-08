import React, {Component} from 'react';
import {isAuthenticated} from '../auth/index';
// import defaultProfile_Pic from '../images/avatar.jpg';
import {create_post} from './apiPost';
import { Redirect } from 'react-router-dom';

class NewPost extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            body: "",
            photo: "",
            error: "",
            user: {},
            fileSize: 0,
            redirectToProfile: false
        };
    }

    // getphotoURL = (userId) => {
    //     get_user_photo(userId)
    //     .then((data) => {
    //         if(data.error){
    //             this.setState({error: data.error});
    //         }
    //         else {
    //             this.setState({photoURL: data.photo});
    //         }  
    //     });   
    // };

    componentDidMount() {
        this.postData = new FormData();
        this.setState({user: isAuthenticated().data.user})
        
        // this.getphotoURL(userId);
    }

    isValid = () => {
        const {title, body, fileSize} = this.state;

        if(fileSize > 100000) {
            this.setState({error: "File size should be less than 100kb..!!!"});
            return false;
        }

        if(title.length === 0) {
            this.setState({error: "Title is required..!!!"});
            return false;
        }

        if(body.length === 0) {
            this.setState({error: "Body is required..!!!"});
            return false;
        }

        return true;
    }

    handleChange = (field_name) => (event) => {
        this.setState({error: ""});
          
        const value = (field_name === 'photo') ? event.target.files[0] : event.target.value;
        const fileSize = (field_name === 'photo') ? event.target.files[0].size : 0;
        this.postData.set(field_name, value);
        this.setState({ [field_name]: value, fileSize });
    }; 

    clickSubmit = (event) => {
        event.preventDefault();

        if(this.isValid()) {
            const userId = isAuthenticated().data.user._id;
            const token = isAuthenticated().token;
        
            create_post(userId, token, this.postData).then(data => {
                if(data.error) {
                    this.setState({ error: data.error});
                }
                else {
                    console.log('New Post: ', data);
                    this.setState({ title: "", body: "", photo: "", redirectToProfile: true});
                }
            });
        }
    };

    newPostForm = (title, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Photo</label>
                <input 
                    onChange={this.handleChange("photo")} 
                    type="file" 
                    accept="image/*"
                    className="form-control" 
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input 
                    onChange={this.handleChange("title")} 
                    type="text" 
                    className="form-control" 
                    value={title}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea 
                    onChange={this.handleChange("body")} 
                    type="text" 
                    className="form-control" 
                    value={body}
                />
            </div>
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Create Post</button>
        </form>
    );

    render() {

        if(this.state.redirectToProfile) {
            return <Redirect to={`/users/${this.state.user._id}`} />
        }

        // const url = this.state.photoURL ? `http://localhost:8080/${this.state.photoURL}` : defaultProfile_Pic;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Create Post</h2>

                <div className="alert alert-danger" style={{ display: this.state.error ? "" : "none"}}>
                    {this.state.error}
                </div>
              
                {this.newPostForm(this.state.title, this.state.body)}
            </div>
        );
    }
}

export default NewPost;