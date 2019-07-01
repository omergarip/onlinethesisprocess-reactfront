import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from "react-router-dom";
import { getPermissionsByUser, accept, reject } from "../permission/apiPermission";
import { read } from "./apiUser";
import '../css/profile.css';

class PermissionProfile extends Component {
    constructor() {
        super()
        this.state = {
            permissions: [],
            researches: [],
            redirectToSignin: false
        }
    }
    
    reserch = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data => {
            if(data.error) {
                this.setState({ redirectToSignin: true });
            } else {
                this.setState({ users: data});
            }
        });
    }
    
    componentDidMount() {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        getPermissionsByUser(userId, token).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({ permissions: data });
            }
        });
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return this.state != nextState;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.permissions === prevState.permissions) {
            const userId = isAuthenticated().user._id
            const token = isAuthenticated().token
            getPermissionsByUser(userId, token).then(data => {
                if(data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ permissions: data });
                }
            });
        }
    }
    
    acceptPermission = event => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        this.state.permissions[event.target.id].status = 'Accepted'
        this.forceUpdate()
        const permissionId = this.state.permissions[event.target.id]._id;
        const token = isAuthenticated().token;
        const permission = this.state.permissions[event.target.id]
        accept(permissionId, token, permission).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ 
                    loading: false
                })    
            }
        });
    };
    
    rejectPermission = event => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        const permissionId = this.state.permissions[event.target.id]._id;
        const token = isAuthenticated().token;
        reject(permissionId, token).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ 
                    loading: false
                })    
            }
        });
    };
    
    render() {
        const { redirectToSignin, permissions } = this.state
        if(redirectToSignin) return <Redirect to="/signin" />
            
        return (
            <div class="container main-secction mt-5" >
        
                <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>Requested From</th>
                        <th>Department</th>
                        <th>BannerID</th>
                        <th>Email</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    { permissions.map((permission, i) => (
                         permission.status === 'Waiting for permission' ?
                      <tr key={ i }>
                        <td>{ `${permission.permissionFrom.fname} ${permission.permissionFrom.lname}` }</td>
                        <td>{ permission.permissionFrom.department }</td>
                        <td>{ permission.permissionFrom.bannerId }</td>
                        <td>{ permission.permissionFrom.email }</td>
                        <td>
                            <button
                                id={ i }
                                onClick={ this.acceptPermission }
                                className="btn btn-success btn-sm mr-1"
                            >
                                Accept
                            </button>
                            <button
                                id={ i }
                                onClick={ this.rejectPermission }
                                className="btn btn-danger btn-sm"
                            >
                                Reject
                            </button>
                        </td>
                      </tr> : ''
                      ))}
                    </tbody>
                </table>  
                <hr/>
                <h6 className="text-info my-5">Students who have access to read full version of the research topic</h6>
                <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Department</th>
                        <th>BannerID</th>
                        <th>Email</th>
                        <th>Research Topic</th>
                      </tr>
                    </thead>
                    <tbody>
                    { permissions.map((permission, i) => (
                         permission.status === 'Accepted' ?
                      <tr key={ i }>
                        <td>{ `${permission.permissionFrom.fname} ${permission.permissionFrom.lname}` }</td>
                        <td>{ permission.permissionFrom.department }</td>
                        <td>{ permission.permissionFrom.bannerId }</td>
                        <td>{ permission.permissionFrom.email }</td>
                        <td>{ permission.permissionFor.title }</td>
                      </tr> : ''
                      ))}
                    </tbody>
                </table>  
                 
                
            </div>
        );
    }
}

export default PermissionProfile