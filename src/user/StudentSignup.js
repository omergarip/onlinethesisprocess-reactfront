import React, { Component } from 'react';
import { studentSignup, signin, authenticate } from '../auth';

import { Link } from 'react-router-dom';
import { Redirect } from "react-router-dom";
import '../css/signup.css';

class StudentSignup extends Component {
    constructor() {
        super()
        this.state = {
            username: "",
            fname: "",
            lname: "",
            email: "",
            password: "",
            bannerId: "",
            department: "",
            userType: "student",
            error: "",
            open: false,
            redirectToHome: false
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
        const { username, fname, lname,
                email, password, userType,
                department, bannerId } = this.state;
        const user = {
            username, fname, lname,
            email, password, userType,
            department, bannerId 
        };
        const login = {
            username, password
        }
        studentSignup(user).then(data => {
            if(data.error) this.setState({ error: data.error });
            else 
                this.setState({
                    username: "",
                    fname: "",
                    lname: "",
                    email: "",
                    password: "",
                    department: "",
                    bannerId: "",
                    userType: "student",
                    error: "",
                    open: true,
                    redirectToHome: true
                });
        });
        signin(login).then(data => {
            if(data.error) this.setState({ error: data.error, loading: false });
            else 
               {
                   authenticate(data, () => {
                       this.setState({ redirectToReferer: true })
                   })
               }
        });
    };
    
    signupForm = ( username, fname, lname,
                   email, password,
                   department, bannerId ) => (

    	<form>
        <div className="card signupCard"  style={{width: "33.5rem", height: "33rem"}}>
			<div className="card-header">
				<h3>Sign Up</h3>
			</div>
			<div className="card-body">
			    <div className="row">
    			    <div className="col-lg-12 mx-auto">
        			    <div className="input-group form-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="fas fa-user"></i></span>
                            </div>
                            <input onChange={ this.handleChange("bannerId") } type="text" className="form-control" 
                                    value={ bannerId } placeholder="Please enter your banner ID."/>
                        </div>
    			        <div className="input-group form-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="fas fa-user"></i></span>
                            </div>
                            <input onChange={ this.handleChange("username") } type="text" className="form-control" 
                                    value={ username } placeholder="Please enter your username."/>
                        </div>
                        <div className="input-group form-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                            </div>
                            <input onChange={ this.handleChange("email") } type="email" className="form-control" 
                                    value={ email } placeholder="Please enter your email."/>
                        </div>
                        <div className="input-group form-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text"><i className="fas fa-key"></i></span>
                            </div>
                            <input onChange={ this.handleChange("password") } type="password" className="form-control" 
                                    value={ password } placeholder="Please enter your password."/>
                        </div>
                        <div className="input-group form-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text"><i className="fas fa-address-book"></i></span>
                            </div>
                            <input onChange={ this.handleChange("fname") } type="text" className="form-control" 
                                    value={ fname } placeholder="Please enter your first name"/>
                        </div>
                       <div className="input-group form-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="fas fa-address-book"></i></span>
                            </div>
                            <input onChange={ this.handleChange("lname") } type="text" className="form-control" 
                                    value={ lname } placeholder="Please enter your last name"/>
                        </div>
                        <div className="form-group">
                            <select onChange={ this.handleChange("department") } className="form-control" id="department">
                                <option value="">Please select your department</option>
                                <option value="Biological Sciences Dept">Biological Sciences Dept</option>
                                <option value="Chemical Engineering">Chemical Engineering</option>
                                <option value="Chemistry Dept">Chemistry Dept</option>
                                <option value="Civil/Environmental & Chemical Engineering">Civil/Environmental & Chemical Engineering</option>
                                <option value="Computer Science & Information Systems">Computer Science & Information Systems</option> 
                                <option value="Electrical & Computer Engineering">Electrical & Computer Engineering</option>    
                                <option value="Engineering Management">Engineering Management</option>    
                                <option value="Engineering Technology">Engineering Technology</option>    
                                <option value="Geological & Environmental Sciences Dept">Geological & Environmental Sciences Dept</option>    
                                <option value="Material Science & Engineering">Material Science & Engineering</option>    
                                <option value="Mathematics & Statistics Dept">Mathematics & Statistics Dept</option>    
                                <option value="Mechanical, Industrial & Manufacturing Engineering Dept">Mechanical, Industrial & Manufacturing Engineering Dept</option>    
                                <option value="Physics & Astronomy Dept">Physics & Astronomy Dept</option>    
                                <option value="YSU-BaccMed">YSU-BaccMed</option>    
                            </select>
                        </div>
                        <div className="form-group">
                            <button onClick = { this.clickSubmit } className="btn float-right btn-raised login_btn">
                                Sign Up
                            </button>
                        </div>
                    </div>
    			</div>
    		</div>  
		</div>
		</form>
	    
    )
    
    render() {
        const { username, fname, lname,
                email, password,
                department, bannerId, error, 
                open, redirectToHome } = this.state;
        if (redirectToHome) {
            
            return <Redirect to={`/signin`} />;
        }
        return (
                <div className="container container_lg">
                    <div className="alert alert-danger mt-5" style={{ display: error ? "" : "none" }}>
                        { error }
                    </div>
                    <div className="alert alert-info mt-5" style={{ display: open ? "" : "none" }}>
                        New account is successfully created. Please 
                        <Link to="/signin"> Sign In</Link>.
                    </div>
                    <div className="d-flex justify-content-center h-100" id="formsignup">
                        
                        
                        { this.signupForm( username, fname, lname,
                                           email, password,
                                           department, bannerId ) }
                    </div>
                </div>
            )
    }
}

export default StudentSignup;