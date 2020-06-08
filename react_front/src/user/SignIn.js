import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {user_SignIn, authenticate} from '../auth/index';

class SignIn extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false
        }
    }

    handleChange = (field_name) => (event) => {
        this.setState({error: ""});
        this.setState({ [field_name]: event.target.value });
    }; 

    clickSubmit = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const {email, password} = this.state;
        const user = {
            email,
            password
        };
   
        // console.log(user);
        
        user_SignIn(user).then(data => {
            if(data.error) {
                this.setState({ error: data.error, loading: false});
            }
            else {
                // Authenticate 
                authenticate(data, () => {
                    this.setState({redirectToReferer: true})
                });
            }
        })

    };

    render() {

        if(this.state.redirectToReferer) {
            return <Redirect to="/" />
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">SignIn</h2>

                <div className="alert alert-primary" style={{ display: this.state.error ? "" : "none"}}>
                    {this.state.error}
                </div>

                { this.state.loading ? (<div className="jumbotron text-center"><h3>Loading...</h3></div>) : ("")}

                <form>
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

export default SignIn;