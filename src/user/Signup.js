import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/ylogo.png';
import '../css/signup.css';

class Signup extends Component {
   render() {
        return (
                <div className="container">
                    <img className="logo" src={ Logo }  alt="YSU" />
                    <div className="card bg-light mb-3" id="card">
                        <div className="card-body">
                            <div className="form-group">
                                <Link 
                                    id="faculty"
                                    className="form-control btn btn-raised btn-success mb-3 mr-5"
                                    to={ '/signup/faculty' } >
                                    Are you a faculty member?
                                </Link>
                                <Link 
                                    id="faculty"
                                    className="form-control btn btn-raised btn-primary mr-5"
                                    to={ '/signup/student' } >
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