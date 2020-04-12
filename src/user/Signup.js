import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/ylogo.png';

class Signup extends Component {
    render() {
        return (
            <div className="container d-flex flex-column">
                <img className="logo" src={Logo} alt="YSU" />
                <div className="card bg-light" id="card">
                    <div className="card-body">
                        <div className="form-group">
                            <Link
                                id="faculty"
                                className="form-control btn btn-raised btn-success mb-3 mr-5 signupButton"
                                to={'/signup/faculty'} >
                                Are you a faculty member?
                                </Link>
                            <Link
                                id="faculty"
                                className="form-control btn btn-raised btn-primary mr-5 signupButton"
                                to={'/signup/student'} >
                                Are you a student?
                                </Link>
                        </div>
                    </div>
                </div>


            </div>

        )
    }
}

export default Signup;