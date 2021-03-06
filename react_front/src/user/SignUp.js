import React, {Component} from 'react';
import {user_SignUp} from '../auth/index';

class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false
        }
    }

    handleChange = (field_name) => (event) => {
        this.setState({error: ""});
        this.setState({ [field_name]: event.target.value });
    }; 

    clickSubmit = (event) => {
        event.preventDefault();
        const {name, email, password} = this.state;
        const user = {
            name,
            email,
            password
        };
        
        user_SignUp(user).then(data => {
            if(data.error) {
                this.setState({ error: data.error});
            }
            else {
                this.setState({
                    name: "",
                    email: "",
                    password: "",
                    error: "",
                    open: true
                });
            }
        })
    };

    render() {
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">SignUp</h2>

                <div className="alert alert-danger" style={{ display: this.state.error ? "" : "none"}}>
                    {this.state.error}
                </div>

                <div className="alert alert-info" style={{ display: this.state.open ? "" : "none"}}>
                    Successfully Registered.
                </div>

                <form>
                    <div className="form-group">
                        <label className="text-muted">Name</label>
                        <input 
                            onChange={this.handleChange("name")} 
                            type="text" 
                            className="form-control" 
                            value={this.state.name}
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Email</label>
                        <input 
                            onChange={this.handleChange("email")} 
                            type="email" 
                            className="form-control" 
                            value={this.state.email}
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
                    <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Submit</button>
                </form>
            </div>
        );
    }
}

export default SignUp;