import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { signin, authenticate } from '../auth';

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

    handleChange = (name) => event => {
        this.setState({ error: "" });
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
            if (data.error) this.setState({ error: data.error, loading: false });
            else {
                authenticate(data, () => {
                    this.setState({ redirectToReferer: true })
                })
            }
        });
    };


    signinForm = (username, password) => (
        <form>
            <div className="card signupCard" style={{ width: "33.5rem", height: "21rem", marginTop: "13rem", marginBottom: "35.5rem" }}>
                <div className="card-header">
                    <h3>Sign In</h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-12 mx-auto">
                            <div className="input-group form-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                                </div>
                                <input onChange={this.handleChange("username")} type="text" className="form-control"
                                    value={username} placeholder="Please enter your username." />
                            </div>
                            <div className="input-group form-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-key"></i></span>
                                </div>
                                <input onChange={this.handleChange("password")} type="password" className="form-control"
                                    value={password} placeholder="Please enter your password." />
                            </div>
                            <div className="form-group">
                                <button onClick={this.clickSubmit} className="btn float-right btn-raised login_btn">
                                    Sign In
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )

    redirectToTarget = () => {
        this.props.history.push('/')
    }

    render() {
        const { username, password, error, redirectToReferer, loading } = this.state;

        if (redirectToReferer) {
            this.redirectToTarget()
        }
        return (
            <div className="container">
                <div className="alert alert-danger mt-5" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : ("")}
                <div className="d-flex justify-content-center h-100" id="formsignin">
                    {this.signinForm(username, password)}
                </div>
            </div>

        )
    }
}

export default Signin;