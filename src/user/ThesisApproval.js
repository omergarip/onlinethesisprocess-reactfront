import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from "react-router-dom";
import { getThesisByAdviserId, updateThesis, getThesisByChapterId } from "../thesis/apiThesis";
import { updateThesisId } from '../process/apiProcess'
import DefaultProfile from '../images/avatar.png';
import Loading from '../core/Loading';

class ThesisApproval extends Component {
    constructor() {
        super()
        this.state = {
            redirectToBack: false,
            students: [],
            chapters: [],
            done: undefined,
            success: undefined
        }
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        let theses = []
        let students = []
        getThesisByAdviserId(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {

                    data.map((element, i) => {
                        if (element.finalStatus === 'Sent') {

                            theses.push(data[i])
                        }
                        console.log(element.finalStatus)
                        students.push(data[i].studentId)
                    })

                    console.log(data.studentId)
                }
                this.setState({
                    students,
                    theses,
                    done: true
                })
            });

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.success !== this.state.success) {
            const userId = isAuthenticated().user._id
            const token = isAuthenticated().token
            let theses = []
            let students = []
            getThesisByAdviserId(userId, token)
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {

                        data.map((element, i) => {
                            if (element.finalStatus === 'Sent') {

                                theses.push(data[i])
                            }
                            console.log(element.finalStatus)
                            students.push(data[i].studentId)
                        })

                        console.log(data.studentId)
                    }
                    this.setState({
                        students,
                        theses,
                        done: true
                    })
                });
        }

    }




    clickSubmit = event => {
        event.preventDefault();
        const introId = event.target.id;
        const token = isAuthenticated().token;
        const status = 'Approved'
        const introduction = { status }
        updateThesis(introId, token, introduction).then(data => {
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

    acceptRequest = event => {
        event.preventDefault();
        const thesisId = event.target.id
        const token = isAuthenticated().token
        let finalStatus = 'Approved'
        let isFinal = true;
        const thesis = { isFinal, finalStatus }
        updateThesis(thesisId, token, thesis)
        const pId = event.target.name
        updateThesisId(pId, thesisId, token).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    done: true,
                    success: true
                });
            }
        });
    };

    rejectRequest = event => {
        event.preventDefault();
        const thesisId = event.target.id
        const token = isAuthenticated().token
        let finalStatus = 'Not Sent'
        const thesis = { finalStatus }
        updateThesis(thesisId, token, thesis).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    done: true,
                    success: true
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
        updateThesis(introId, token, introduction).then(data => {
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
        const { redirectToSignin, theses, chapters, done, students } = this.state
        if (redirectToSignin) return <Redirect to="/signin" />

        const photoUrl = isAuthenticated().user._id ?
            `${process.env.REACT_APP_API_URL}/user/photo/${isAuthenticated().user._id}?
        ${new Date().getTime()}` :
            DefaultProfile

        return (
            <>
                {
                    !theses ?
                        <Loading done={done} /> :
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
                                        <li className="">
                                            <Link to={`/user/${isAuthenticated().user._id}/chapter-approval`}>
                                                <p>Chapter Approval</p>
                                            </Link>
                                        </li>
                                        <li className="active">
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
                                            <th>ID</th>
                                            <th>Student's Name</th>
                                            <th>Thesis</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {theses.map((thesis, i) => (

                                            <tr key={i}>
                                                <td>{students[i].bannerId}</td>
                                                <td>{`${students[i].fname} ${students[i].lname}`}</td>
                                                <td><Link
                                                    id="process__link"
                                                    className="btn btn-warning"
                                                    to={`/thesis-process/${theses[i].processId}/thesis/${theses[i]._id}/chapters`}
                                                >
                                                    View Thesis
                                                </Link></td>
                                                <td>
                                                    <button
                                                        name={theses[i].processId}
                                                        id={theses[i]._id}
                                                        onClick={this.acceptRequest}
                                                        className="btn btn-success btn-sm mr-1"
                                                    >
                                                        Accept
                                                        </button>
                                                    <button
                                                        name={theses[i].processId}
                                                        id={theses[i]._id}
                                                        onClick={this.rejectRequest}
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>

                                        ))}
                                    </tbody>
                                </table>



                            </div>
                        </section>
                }
            </>
        );
    }
}

export default ThesisApproval