import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from "react-router-dom";
import { getAdviserByStudentId, create, remove } from "../adviser/apiAdviser";
import { read } from "./apiUser";
import DefaultProfile from '../images/avatar.png';
import Background from '../images/jones.jpg';
import Logo from '../images/ylogo.png';
import DeleteUser from './DeleteUser';
import '../css/profile.css';

class Profile extends Component {
    constructor() {
        super()
        this.state = {
            user: "",
            advisers: [],
            introduction: "",
            message: "",
            redirectToSignin: false
        }
    }
    
    init = (userId) => {
        
        const token = isAuthenticated().token
        read(userId, token)
        .then(data => {
            if(data.error) {
                this.setState({ redirectToSignin: true });
            } else {
                this.setState({ user: data});
            }
        });
        
    }
    
    componentDidMount() {
        const userId = this.props.match.params.userId
        const token = isAuthenticated().token
        this.init(userId);
        const studentId = isAuthenticated().user._id
        getAdviserByStudentId(studentId, token)
        .then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({ advisers: data });
            }
        });
        
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return this.state != nextState;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        const studentId = isAuthenticated().user._id
        const token = isAuthenticated().token
        if (this.state.advisers === prevState.advisers) {
            getAdviserByStudentId(studentId, token)
            .then(data => {
                if(data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ advisers: data });
                }
            });
        }
    }
    
    componentWillReceiveProps(props) {
        const userId = props.match.params.userId
        this.init(userId);
    
    }
    
     handleChange = ( name ) => event => {
        this.setState({ error: ""});
        this.setState({ 
            [name]: event.target.value
        });
    };
    
    sendRequest = event => {
        event.preventDefault();
        this.setState({ 
            loading: true,
        });
        const requestedFrom = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const requestedTo = this.props.match.params.userId
        const introduction = this.state.introduction
        const message = this.state.message
        const request = {
            requestedFrom, requestedTo, introduction, message
        };
        create(requestedFrom, token, request).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ 
                    loading: false
                })    
            }
        });
    };

    cancelRequest = event => {
        event.preventDefault();
        this.setState({ loading: true });
        const requestId = this.state.advisers[event.target.name]._id
        const token = isAuthenticated().token;
        remove(requestId, token).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ 
                    loading: false,
                    advisers: []
                })    
            }
        });
    };
    
    render() {
        const { redirectToSignin, user, advisers,
                introduction, message } = this.state
        if(redirectToSignin) return <Redirect to="/signin" />
        
        const photoUrl = user._id ? 
            `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?
            ${new Date().getTime()}`: 
            DefaultProfile
            
        return (
            <div className="container main-secction">
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12 image-section">
                        <img src={ Background }/>
                    </div>
                    <div className="row user-left-part">
                        <div className="col-md-3 col-sm-3 col-xs-12 user-profil-part pull-left">
                            <div className="row ">
                                <div className="col-md-12 col-md-12-sm-12 col-xs-12 user-image text-center">
                                    <img src={ photoUrl }  className="rounded-circle"/>
                                </div>
                                
                                    { isAuthenticated().user && 
                                        isAuthenticated().user._id === user._id && (
                                        <div className="col-md-12 col-sm-12 col-xs-12 user-detail-section1 text-center">
                                            <Link 
                                                id="btn-contact"
                                                className="btn btn-raised btn-warning btn-block follow"
                                                to={`/user/edit/${user._id}`} >
                                                Edit Profile
                                            </Link>
                                            <DeleteUser userId={ user._id } />
                                        </div>    
                                    )}
                            </div>
                        </div>
                        <div class="col-md-9 col-sm-9 col-xs-12 pull-right profile-right-section">
                            <div class="row profile-right-section-row">
                                <div class="col-md-12 profile-header">
                                    <div class="row">
                                        <div class="col-md-8 col-sm-6 col-xs-6 profile-header-section1 pull-left">
                                            <h1>{`${user.fname}  ${user.lname}`}</h1>
                                            <h5>{ user.department }</h5>
                                            <hr/>
                                        </div>
                                        { isAuthenticated().user && isAuthenticated().user.userType === 'student' &&
                                          !(isAuthenticated().user._id === user._id) ? (
                                                advisers.length === 0 ?
                                                    <div className="col-md-4 col-sm-6 col-xs-6 profile-header-section1 text-right pull-rigth">
                                                        <button 
                                                        data-toggle="modal" data-target="#exampleModal"     
                                                            className="btn btn-primary btn-block"
                                                        > 
                                                            Send Request
                                                        </button> 
                                                        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                            <div class="modal-dialog modal-lg" role="document">
                                                                <div class="modal-content">
                                                                <div class="modal-header">
                                                                    <h5 class="modal-title" id="exampleModalLabel">New message</h5>
                                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                    <span aria-hidden="true">&times;</span>
                                                                    </button>
                                                                </div>
                                                                <div class="modal-body">
                                                                    <form>
                                                                    <div class="form-group">
                                                                        <label for="recipient-name" class="float-left col-form-label">Description*:</label>
                                                                        <textarea 
                                                                            onChange={this.handleChange("introduction")} 
                                                                            rows="10" type="text" class="form-control" id="recipient-name" 
                                                                            placeholder="Please briefly explain your research topic">
                                                                            </textarea>
                                                                    </div>
                                                                    <div class="form-group">
                                                                        <label for="message-text" class="float-left col-form-label">Message:</label>
                                                                        <textarea 
                                                                            onChange={this.handleChange("message")} 
                                                                            rows="5" class="form-control" id="message-text" 
                                                                            placeholder="You can send message to the faculty member"></textarea>
                                                                    </div>
                                                                    </form>
                                                                </div>
                                                                <div class="modal-footer">
                                                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                                    <button onClick={this.sendRequest} type="button" data-dismiss="modal" class="btn btn-primary">Send Request</button>
                                                                </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                :  
                                                advisers[0].requestedFrom === isAuthenticated().user._id &&
                                                advisers[0].requestedTo._id === this.props.match.params.userId ? 
                                                    advisers[0].status === 'Accepted' ?    
                                                        <div 
                                                            className="col-md-4 col-sm-6 col-xs-6 
                                                            profile-header-section1 text-right pull-rigth"
                                                        >
                                                            <p className="text-primary">{ user.fname } { user.lname } is your adviser.</p> 
                                                        </div> 
                                                    : 
                                                    advisers[0].status === 'Waiting for permission' ? 
                                                        <div 
                                                            className="col-md-4 col-sm-6 col-xs-6 
                                                            profile-header-section1 text-right pull-rigth"
                                                        >
                                                            <button 
                                                                onClick={this.clickSubmit}
                                                                className="btn btn-warning btn-block disabled"
                                                            > 
                                                                Waiting for permission
                                                            </button> 
                                                            <a 
                                                                id="cancelPermission"
                                                                onClick={this.cancelRequest}
                                                                name={ advisers[0] }
                                                            >
                                                                Click here to cancel it
                                                            </a> 
                                                        </div> 
                                                    : '' 
                                                : ''
                                                   
                                                
                                            ) : ''
                                         }



                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="form-group">
                                                <h6><strong>Email:</strong> { user.email }</h6>
                                                <h6><strong>Area of Research Interest:</strong> { user.areas }</h6>
                                            </div>
                                            
                                  
                                        </div>
                                        <div className="col-md-4 img-main-rightPart">
                                            <div className="row">
                                                <div className="col-md-12 image-right">
                                                    <img src={ Logo }/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    
            
        );
    }
}

export default Profile