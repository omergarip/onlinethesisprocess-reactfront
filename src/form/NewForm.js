import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from "react-router-dom";
import { getAdviserByStudentId } from "../adviser/apiAdviser";
import { create } from "./apiForm";
import '../css/profile.css';
import Logo from '../images/ylogo.png'

class NewForm extends Component {
    constructor() {
        super()
        this.state = {
            advisers: "",
            address: "",
            proposedTitle: "",
            date: "",
            redirectToSignin: false
        }
    }
    
    componentDidMount() {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        getAdviserByStudentId(userId, token).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({ advisers: data[0].requestedTo });
            }
        });
    }
    
    isValid = () => {
        const { proposedTitle, date, address } = this.state;
        if (proposedTitle.length === 0 || date.length === 0 || address.length === 0) {
            this.setState({ error: "All fields are required", loading: false });
            return false;
        }
        return true;
    };

    handleChange = ( name ) => event => {
        this.setState({ error: ""});
        this.setState({ 
            [name]: event.target.value
        });
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });
        
        if (this.isValid()) {
            const studentId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const adviserId = this.state.advisers._id
            const { proposedTitle, address, date } = this.state;
            const form = {
                studentId, adviserId, address, proposedTitle, date 
            };
            create(studentId, token, form).then(data => {
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    this.setState({ 
                        loading: false,
                        proposedTitle: '',
                        date: '',
                        redirectToProfile: true
                    })    
                }
            });
        }
    };

    render() {
        const { redirectToSignin, advisers } = this.state
        if(redirectToSignin) return <Redirect to="/signin" />
            
        return (
            <div class="container main-secction" >
                <div className="d-flex flex-row justify-content-center">
                    <img
                        style={{ height: "200px", width: "auto" }}
                        className="img-fluid" src={ Logo } /> 
                </div>
                <h3 className="text-center"><strong>SUPERVISOR APPOINTMENT FORM</strong></h3>
                <form>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="text-muted">Banner ID</label>
                                <input
                                    value= { isAuthenticated().user.bannerId }
                                    type="text"
                                    className="form-control"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className=" col-md-5 ">
                            <div className="form-group">
                                <label className="text-muted">Student Name</label>
                                <input
                                    value = { `${isAuthenticated().user.fname} ${isAuthenticated().user.lname}`}
                                    type="text"
                                    className="form-control"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className=" col-md-4 ">
                            <div className="form-group">
                                <label className="text-muted">Adviser Name</label>
                                <input
                                    value = { `${advisers.fname} ${advisers.lname}` }
                                    type="text"
                                    className="form-control"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-12">
                            <label className="text-muted">Address</label>
                            <input
                                onChange={this.handleChange("address")}   
                                type="text"
                                className="form-control"
                            />
                        </div>
                        <div className="form-group col-md-8">
                            <label className="text-muted">Proposed title of thesis/dissertation/portfolio</label>
                            <input
                                onChange={this.handleChange("proposedTitle")}    
                                type="text"
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="text-muted">Anticipated Completion Date</label>
                                <input
                                    onChange={this.handleChange("date")} 
                                    type="text"
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <button
                            onClick={this.clickSubmit}
                            className="mb-3 ml-3 btn btn-raised btn-primary"
                        >
                            Submit Form
                        </button>
                    </div>
                </form> 
                 
                
            </div>
        );
    }
}

export default NewForm