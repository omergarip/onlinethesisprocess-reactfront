import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { signin, authenticate } from '../auth';
import '../css/signin.css';

class Signin extends Component {
    constructor() {
        super()
        this.state = {
            username: "",
            fname: "",
            lname: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false
        }
    }
    
    handleChange = ( name ) => event => {
        this.setState({ error: ""});
        this.setState({ 
            [name]: event.target.value
        });
    };
    
    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true })
        const { username, password } = this.state;
        const user = {
            username,
            password
        };
        signin(user).then(data => {
            if(data.error) this.setState({ error: data.error, loading: false });
            else 
               {
                   authenticate(data, () => {
                       this.setState({ redirectToReferer: true })
                   })
               }
        });
    };
    
    
    signinForm = (username, password) => (
        <form className="box">
            <h1>Sign In</h1>
            <input onChange={ this.handleChange("username") } type="text" style={{ color: "white" }} 
                                        value={ username } placeholder="Username"/>
            <input onChange={ this.handleChange("password") } type="password" 
                                        value={ password } placeholder="Password"/>      
            <input onClick = { this.clickSubmit } type="submit" value="Sign In"/>
            
        </form>
    )
    
    render() {
        const { username, password, error, redirectToReferer, loading } = this.state;
        
        if(redirectToReferer) {
            return <Redirect to="/" />
        }
        return (
                <div className="container">
                    <div className="alert alert-danger mt-5" style={{ display: error ? "" : "none" }}>
                        { error }
                    </div>
                    { loading ? (
                        <div className="jumbotron text-center">
                            <h2>Loading...</h2>
                        </div>
                    ) : ( "")}
                    { this.signinForm(username, password) }
                </div>
                
            )
    }
}

export default Signin;