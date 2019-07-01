import React, { Component } from "react";
import { list } from "./apiResearch";
import { isAuthenticated } from "../auth";
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
            deleted: false
        };
    }
    
    componentDidMount() {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        getPermissions(userId).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({ permissions: data });
            }
        });
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
        const userId = isAuthenticated().user._id
        if (this.state.permissions === prevState.permissions) {
            getPermissions(userId).then(data => {
                if(data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ permissions: data });
                }
            });
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
    
    renderPosts = researches => (
        <div className="row">
            
            { researches.map((research, i) => (
                <div className="card col-md-11 mx-auto" key={ i }>
                <h5 className="card-header">{ research.title }</h5>
                    <div className="card-body">
                        <p className="card-text">
                            { research.description }
                        </p>
                        <p className="">
                            <strong>Submitted By: {research.createdBy.fname } {research.createdBy.lname}</strong>
                        </p>
                        <p className="">
                            <strong>Department: {research.createdBy.department } </strong>
                        </p>
                        {  }
                        
                        { this.state.permissions.length === 0 ? 
                            <button
                                id={ research._id }
                                name= { research.createdBy._id }
                                onClick={this.clickSubmit}
                                className="btn btn-raised btn-primary btn-sm float-right"> 
                                    Ask Permission To Read
                            </button> : this.state.permissions.map((permission, i) =>(
                               permission.permissionFrom === isAuthenticated().user._id  ? (
                                    permission.status === 'Accepted' ?
                                      <Link 
                                            key={ i }
                                            to={`/research/${research._id}`}
                                            className="btn btn-raised btn-primary btn-sm float-right">
                                                Read More
                                        </Link> 
                                       : permission.status === 'Waiting for permission' ? 
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
                                        </div> : ''
                                        
                                        
                                        
                                    
                                ) : <button
                                        id={ research._id }
                                        onClick={this.clickSubmit}
                                        className="btn btn-raised btn-primary btn-sm float-right"> 
                                            Ask Permission To Read
                                    </button>
                                
                        ) ) }
                        
                    </div>
                </div>
            ))}
        </div>
    );
    render() {
        const { researches } = this.state;
        
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Recent Researches</h2>
                <Link to={`/research/create`} className="btn btn-primary my-3 ml-5"><i className="fas fa-plus"></i> Create</Link>
                { this.renderPosts(researches) }
            </div>
            );
    }
}

export default Researches;