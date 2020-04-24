import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from "react-router-dom";
import { getRequestsByUser, accept, remove } from "../adviser/apiAdviser";
import { getProcessByUserId, updateAdviser } from '../process/apiProcess'
import DefaultProfile from '../images/avatar.png';
import { createNotification } from '../notification/apiNotification'


class RequestProfile extends Component {
    constructor() {
        super()
        this.state = {
            requests: [],
            redirectToSignin: false,
            process: [],
            loading: true
        }
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        getRequestsByUser(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    if (data.length !== 0) {
                        this.setState({
                            requests: data
                        });
                        const studentId = data[0].requestedFrom._id
                        getProcessByUserId(studentId, token).then(data => {
                            if (data.error) {
                                console.log(data.error)
                            } {
                                if (data.length === 0)
                                    console.log(data.error)
                                else {
                                    this.setState({
                                        process: data[0]
                                    });
                                    console.log(data)
                                }

                            }
                        });
                    }
                }
            });


    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state != nextState;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        if (this.state.requests === prevState.requests) {
            getRequestsByUser(userId, token)
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        this.setState({ requests: data });
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




    acceptRequest = event => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        this.state.requests[event.target.id].status = 'Accepted'
        this.forceUpdate()
        const requestId = this.state.requests[event.target.id]._id;
        const notificationTo = this.state.requests[0].requestedFrom
        const notification = `${isAuthenticated().user.fname} ${isAuthenticated().user.lname} accepted your advisee request. Please click here to continue your process`
        const redirect = `/thesis-process/${this.state.process._id}`
        const token = isAuthenticated().token;
        const request = this.state.requests[event.target.id]
        accept(requestId, token, request).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    loading: false
                })
                this.createNotification(notificationTo, notification, redirect)
            }
        });
        const userId = isAuthenticated().user._id
        const pId = this.state.process._id;
        updateAdviser(pId, userId, token).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    loading: false
                });
            }
        });
    };

    rejectRequest = event => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        const notificationTo = this.state.requests[0].requestedFrom
        const notification = `${isAuthenticated().user.fname} ${isAuthenticated().user.lname} rejected your advisee request. Please click here to select another advisor`
        const redirect = `/faculty-members`
        const requestId = this.state.requests[event.target.id]._id;
        const token = isAuthenticated().token;
        remove(requestId, token).then(data => {
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

    openModal = (id, msg, info) => (
        <div class="modal fade" id={id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{msg}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        {info}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );

    render() {
        const { redirectToSignin, requests } = this.state
        if (redirectToSignin) return <Redirect to="/signin" />

        const photoUrl = isAuthenticated().user._id ?
            `${process.env.REACT_APP_API_URL}/user/photo/${isAuthenticated().user._id}?
        ${new Date().getTime()}` :
            DefaultProfile

        return (

            <section>
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
                            <li >
                                <Link to={`/user/${isAuthenticated().user._id}/permission`}>
                                    <p>Research Topic Permissions</p>
                                </Link>
                            </li>
                            <li class="active">
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
                <div class="container main-secction" id="requrestpage">

                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Requested From</th>
                                <th>Department</th>
                                <th>BannerID</th>
                                <th>Email</th>
                                <th>Description</th>
                                <th>Message</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request, i) => (
                                request.status === 'Waiting for permission' ?
                                    <tr key={i}>
                                        <td>{`${request.requestedFrom.fname} ${request.requestedFrom.lname}`}</td>
                                        <td>{request.requestedFrom.department}</td>
                                        <td>{request.requestedFrom.bannerId}</td>
                                        <td>{request.requestedFrom.email}</td>
                                        <td>
                                            <button type="button" class="btn btn-primary"
                                                data-toggle="modal" data-target="#introModal">
                                                Introduction
                                        </button>
                                            {this.openModal('introModal', 'Introduction', request.introduction)}
                                        </td>
                                        <td><button type="button" class="btn btn-primary"
                                            data-toggle="modal" data-target="#messageModal">
                                            Message
                                        </button>
                                            {this.openModal('messageModal', 'Message', request.message)}</td>
                                        <td>
                                            <button
                                                id={i}
                                                onClick={this.acceptRequest}
                                                className="btn btn-success btn-sm mr-1"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                id={i}
                                                onClick={this.rejectRequest}
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
                    <h6 className="text-info my-5">Your Students</h6>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Department</th>
                                <th>BannerID</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request, i) => (
                                request.status === 'Accepted' ?
                                    <tr key={i}>
                                        <td>{`${request.requestedFrom.fname} ${request.requestedFrom.lname}`}</td>
                                        <td>{request.requestedFrom.department}</td>
                                        <td>{request.requestedFrom.bannerId}</td>
                                        <td>{request.requestedFrom.email}</td>
                                    </tr> : ''
                            ))}
                        </tbody>
                    </table>


                </div>
            </section>
        );
    }
}

export default RequestProfile;