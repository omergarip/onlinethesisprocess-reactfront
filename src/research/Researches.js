import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { list } from "./apiResearch";
import { isAuthenticated } from "../auth";
import Moment from 'react-moment';
import { getPermissions, create, remove } from "../permission/apiPermission";
import '../css/main.css';
import { Link } from 'react-router-dom';

class Researches extends Component {
    constructor() {
        super();
        this.state = {
            researchId: "",
            researches: [],
            permissions: [],
            deleted: false,
        };
    }
    
    componentDidMount() {
        if (isAuthenticated())
        {
            const userId = isAuthenticated().user._id
            getPermissions(userId).then(data => {
                if(data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ permissions: data });
                }
            });
        }
            
        
        list().then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({ researches: data });
            }
        });
        
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return this.state != nextState;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.permissions === prevState.permissions) {
            if (isAuthenticated())
            {
                const userId = isAuthenticated().user._id
                getPermissions(userId).then(data => {
                    if(data.error) {
                        console.log(data.error)
                    } else {
                        this.setState({ permissions: data });
                    }
                });
            }
        }
    }

    
    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });
        const permissionFrom = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const permissionFor = event.target.id
        const permissionTo = event.target.name;
        const permission = {
            permissionFrom, permissionTo, permissionFor 
        };
        create(permissionFor, token, permission).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ 
                    loading: false
                })    
            }
        });
    };
    
    cancelPermission = event => {
        event.preventDefault();
        this.setState({ loading: true });
        const permissionId = this.state.permissions[event.target.name]._id
        const token = isAuthenticated().token;
        remove(permissionId, token).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ 
                    loading: false,
                    permissions: []
                })    
            }
        });
    };
    
    renderPosts = (recentResearches) => (  
        <div className="row">
            { recentResearches.map((research, i) => (
                
                    <div className="d-flex align-items-stretch">
                        <div className="card card-default">
                            <div className="card-header">
                                { research.title }
                            </div>
                            <div className="card-body">
                                <p className="card-text">
                                    { research.description }
                                </p> 
                                <hr id="seperator" />
                                <div className="researcher__info form-group">
                                    <p className="">
                                        <strong>Submitted By: </strong> 
                                        <a className="researcher__info-btn" href={`/user/${research.createdBy._id}`}>
                                            <img src={ `${process.env.REACT_APP_API_URL}/user/photo/${research.createdBy._id}?${new Date().getTime()}`  } 
                                                alt={ `${research.createdBy.fname} ${research.createdBy.lname}` } 
                                                className="home-profile" 
                                            />
                                            { `${research.createdBy.fname} ${research.createdBy.lname}` } 
                                        </a>
                                    </p>
                                    <p className="home__dep">
                                        <strong>Department:</strong> {research.createdBy.department } 
                                    </p>
                                    { isAuthenticated().user._id === research.createdBy._id ?
                                        <Link 
                                            key={ i }
                                            to={`/research/${research._id}`}
                                            className="form-control btn btn-raised btn-primary btn-sm">
                                                Read More 
                                        </Link>  : ''
                                    }
                                    
                                    { isAuthenticated().user.userType === 'student' && this.state.permissions.length === 0 ? 
                                        <button
                                            id={ research._id }
                                            name= { research.createdBy._id }
                                            onClick={this.clickSubmit}
                                            className="btn btn-raised btn-primary btn-sm float-right"> 
                                                Ask Permission To Read
                                        </button> : this.state.permissions.map((permission, i) =>(
                                        isAuthenticated().user.userType === 'student' ? (
                                            permission.permissionFrom === isAuthenticated().user._id  ? (
                                                permission.status === 'Accepted'
                                                && permission.permissionFor === research._id ?
                                                <Link 
                                                    key={ i }
                                                    to={`/research/${research._id}`}
                                                    className="btn btn-raised btn-primary float-right">
                                                        Read More
                                                </Link> 
                                                : permission.status === 'Waiting for permission' 
                                                && permission.permissionFor === research._id? 
                                                    <div className="form-group float-right"  key={ i }> 
                                                        <button 
                                                            id="waitingPermission"
                                                            className="form-control btn btn-raised btn-warning btn-sm disabled">
                                                                Waiting for permission 
                                                        </button>
                                                        <a 
                                                            name = { i }
                                                            onClick={this.cancelPermission}
                                                            id="cancelPermission"
                                                            className="">
                                                                Click here to cancel it
                                                        </a> 
                                                    </div> : '') :''
                                                    
                                                    
                                                    
                                                
                                            ) : <button
                                                    id={ research._id }
                                                    onClick={this.clickSubmit}
                                                    className="btn btn-raised btn-primary btn-sm float-right"> 
                                                        Ask Permission To Read
                                                </button>
                                            
                                    ) ) }
                                </div>  
                            </div>
                            <div className="card-footer">
                                <Moment parse="YYYY-MM-DD HH:mm" fromNow> { research.created }</Moment>
                            </div>
                        </div>
                    </div>  
                
                
            ) ) }  
        </div>
    )

    render() {
        const { researches, loggedIn } = this.state;
        return (
        <>
            <section className="section__researches ">
                <div className="container">
                    { isAuthenticated() && isAuthenticated().user.userType !== 'student' ? 
                        <Link to={`/research/create`} className="btn btn-primary my-3 ml-5"><i className="fas fa-plus"></i> Create</Link> :
                        ''
                    }
                    <div className="researchers__header">
                        <h2>Recent Research Topics</h2>
                    </div>
                    { this.renderPosts(researches) }   
 
                </div>
            </section>

    
    </>
            );
    }
}

export default Researches;