import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from "react-router-dom";
import { getThesisByAdviserId, updateThesis, getThesisByChapterId } from "../thesis/apiThesis";
import { getProcess } from '../process/apiProcess'
import DefaultProfile from '../images/avatar.png';
import Loading from '../core/Loading';

class ChapterApproval extends Component {
    constructor() {
        super()
        this.state = {
            redirectToBack: false,
            students: [],
            chapters: [],
            theses: '',
            done: undefined
        }
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        let chaptersArray = []
        let theses = []
        let students = []
        getThesisByAdviserId(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {

                    data.map((element, i) => {
                        element.chapters.forEach(a => {
                            if (a.status === 'Sent') {
                                chaptersArray.push(a)
                                theses.push(data[i])
                            }

                        })
                        students.push(data[i].studentId)
                    })
                    console.log(data.studentId)
                }
                this.setState({
                    students,
                    chapters: chaptersArray,
                    theses,
                    done: true
                })
            });

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
                    !chapters ?
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
                                        <li className="active">
                                            <Link to={`/user/${isAuthenticated().user._id}/chapter-approval`}>
                                                <p>Chapter Approval</p>
                                            </Link>
                                        </li>
                                        <li className="">
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
                                            <th>Chapter</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chapters.map((chapter, i) => (

                                            <tr key={i}>
                                                <td>{students[i].bannerId}</td>
                                                <td>{`${students[i].fname} ${students[i].lname}`}</td>
                                                <td>{chapter.title}</td>
                                                <td>
                                                    <Link
                                                        id="process__link"
                                                        className="btn btn-warning"
                                                        to={`/thesis-process/${theses[i].processId}/thesis/${theses[i]._id}/chapter/${chapter._id}`}
                                                    >
                                                        Read and Modify
                                                </Link>
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

export default ChapterApproval