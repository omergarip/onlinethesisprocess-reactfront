import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from "react-router-dom";
import { getPermissionsByUser, accept, reject } from "../permission/apiPermission";
import { read } from "./apiUser";
import { createNotification } from '../notification/apiNotification'
import DefaultProfile from '../images/avatar.png';

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
                if (data.error) {
                    this.setState({ redirectToSignin: true });
                } else {
                    this.setState({ users: data });
                }
            });
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        getPermissionsByUser(userId, token).then(data => {
            if (data.error) {
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
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ permissions: data });
                }
            });
        }
    }


    createNotification = (notificationTo, notification, redirect) => {
        const token = isAuthenticated().token
        const notificationFrom = isAuthenticated().user._id
        const notData = { notificationTo, notificationFrom, notification, redirect }
        createNotification(token, notData).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            }
        });
    }

    acceptPermission = event => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        this.state.permissions[event.target.id].status = 'Accepted'
        this.forceUpdate()
        const researchId = this.state.permissions[0].permissionFor._id
        const title = this.state.permissions[0].permissionFor.title
        const notificationTo = this.state.permissions[0].permissionFrom
        const notification = `${isAuthenticated().user.fname} ${isAuthenticated().user.lname} accepted your requested to access to ${title}. Please click here to access it.`
        const redirect = `/research/${researchId}`
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
                this.createNotification(notificationTo, notification, redirect)
            }
        });
    };

    rejectPermission = event => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        const notificationTo = this.state.permissions[0].permissionFrom
        const title = this.state.permissions[0].permissionFor.title
        const notification = `${isAuthenticated().user.fname} ${isAuthenticated().user.lname} rejected your requested to access to ${title}. Please click here to find another research topic.`
        const redirect = '/researches'
        const permissionId = this.state.permissions[event.target.id]._id;
        const token = isAuthenticated().token;
        reject(permissionId, token).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    loading: false
                })
                this.createNotification(notificationTo, notification, redirect)
            }
        });
    };

    render() {
        const { redirectToSignin, permissions } = this.state
        if (redirectToSignin) return <Redirect to="/signin" />

        const photoUrl = isAuthenticated().user._id ?
            `${process.env.REACT_APP_API_URL}/user/photo/${isAuthenticated().user._id}?
        ${new Date().getTime()}` :
            DefaultProfile

        return (

            <section className='section__permission'>
                <div class="sidebar" data-color="red">
                    <div class="logo">
                        <img src={photoUrl} className="rounded-circle" />
                        <h6>{`${isAuthenticated().user.fname}  ${isAuthenticated().user.lname}`}</h6>
                    </div>
                    <div class="sidebar-wrapper" id="sidebar-wrapper">
                        <ul class="nav">
                            <li >
                                <Link to={`/user/${isAuthenticated().user._id}`}>
                                    <p>My Profile</p>
                                </Link>


                            </li>
                            <li class="active">
                                <Link to={`/user/${isAuthenticated().user._id}/permission`}>
                                    <p>Research Topic Permissions</p>
                                </Link>
                            </li>
                            <li>
                                <Link to={`/user/${isAuthenticated().user._id}/request`}>
                                    <p>Advisee Requests</p>
                                </Link>
                            </li>
                            <li>
                                <Link to={`/user/${isAuthenticated().user._id}/thesis-approval`}>
                                    <p>Thesis Approval</p>
                                </Link>
                            </li>

                        </ul>
                    </div>
                </div>
                <div class="container main-secction" id="requrestpage" >

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
                            {permissions.map((permission, i) => (
                                permission.status === 'Waiting for permission' ?
                                    <tr key={i}>
                                        <td>{`${permission.permissionFrom.fname} ${permission.permissionFrom.lname}`}</td>
                                        <td>{permission.permissionFrom.department}</td>
                                        <td>{permission.permissionFrom.bannerId}</td>
                                        <td>{permission.permissionFrom.email}</td>
                                        <td>
                                            <button
                                                id={i}
                                                onClick={this.acceptPermission}
                                                className="btn btn-success btn-sm mr-1"
                                            >
                                                Accept
                            </button>
                                            <button
                                                id={i}
                                                onClick={this.rejectPermission}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Reject
                            </button>
                                        </td>
                                    </tr> : ''
                            ))}
                        </tbody>
                    </table>
                    <hr />
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
                            {permissions.map((permission, i) => (
                                permission.status === 'Accepted' ?
                                    <tr key={i}>
                                        <td>{`${permission.permissionFrom.fname} ${permission.permissionFrom.lname}`}</td>
                                        <td>{permission.permissionFrom.department}</td>
                                        <td>{permission.permissionFrom.bannerId}</td>
                                        <td>{permission.permissionFrom.email}</td>
                                        <td>{permission.permissionFor.title}</td>
                                    </tr> : ''
                            ))}
                        </tbody>
                    </table>


                </div>
            </section>
        );
    }
}

export default PermissionProfile