import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from "react-router-dom";
import { getIntroductionByAdviserId } from "../thesis/apiThesis";
import { updateIntroStatus } from '../thesis/apiThesis';
import { getProcess } from '../process/apiProcess'
import DefaultProfile from '../images/avatar.png';

class ThesisApproval extends Component {
    constructor() {
        super()
        this.state = {
            redirectToSignin: false,
            students: [],
            introductions: [],
            loading: true
        }
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        getIntroductionByAdviserId(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ introductions: data })
                }
            });


    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state != nextState;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        if (this.state.introductions === prevState.introductions) {
            getIntroductionByAdviserId(userId, token)
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        this.setState({ introductions: data })
                    }
                });
        }
    }

    clickSubmit = event => {
        event.preventDefault();
        const introId = event.target.id;
        const token = isAuthenticated().token;
        const status = 'Approved'
        const introduction = { status }
        updateIntroStatus(introId, token, introduction).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    loading: false,
                    redirectToProfile: true
                });
            }
        });
    };

    rejectIntro = event => {
        event.preventDefault();

        const introId = event.target.id;
        const token = isAuthenticated().token;
        const status = 'Not Sent'
        const introduction = { status }
        updateIntroStatus(introId, token, introduction).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    loading: false,
                    redirectToProfile: true
                });
            }
        });
    }


    render() {
        const { redirectToSignin, introductions } = this.state
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
                            <li>
                                <Link to={`/user/${isAuthenticated().user._id}/permission`}>
                                    <p>Research Topic Permissions</p>
                                </Link>
                            </li>
                            <li>
                                <Link to={`/user/${isAuthenticated().user._id}/request`}>
                                    <p>Advisee Requests</p>
                                </Link>
                            </li>
                            <li className="active">
                                <Link to={`/user/${isAuthenticated().user._id}/request`}>
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
                                <th>Introduction</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {introductions.map((introduction, i) => (
                                introduction.status === 'Sent' ?
                                    <tr key={i}>
                                        <td><Link
                                            id="process__link"
                                            className="btn btn-warning"
                                            to={`/thesis-process/${introduction.processId}/introduction/${introduction._id}`}
                                        >
                                            Read and Edit Introduction
                        </Link></td>
                                        <td>
                                            <button
                                                id={introduction._id}
                                                onClick={this.clickSubmit}
                                                className="btn btn-success btn-sm mr-1"
                                            >
                                                Accept
                            </button>
                                            <button
                                                id={i}
                                                onClick={this.rejectIntro}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Reject
                            </button>
                                        </td>
                                    </tr> : ''
                            ))}
                        </tbody>
                    </table>



                </div>
            </section>
        );
    }
}

export default ThesisApproval