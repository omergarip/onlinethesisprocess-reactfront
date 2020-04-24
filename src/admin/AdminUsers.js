import React, { Component } from 'react';
import { isAuthenticated, signout } from '../auth';
import { Redirect, Link } from "react-router-dom";
import { getAdviserByStudentId, create, remove } from "../adviser/apiAdviser";
import { list } from "../user/apiUser";
import { createNotification, removeByUser } from '../notification/apiNotification'
import DefaultProfile from '../images/avatar.png';
import Logo from '../images/ylogo.png';
import Loading from '../core/Loading';
import DeleteUser from '../user/DeleteUser';
import Sidebar from './Sidebar';


class AdminUsers extends Component {
    constructor() {
        super()
        this.state = {
            users: [],
            done: undefined,
            students: [],
            faculty: [],
            introduction: "",
            message: "",
            redirectToSignin: false
        }
    }

    init = () => {
        let students = []
        let faculty = []
        list()
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToSignin: true });
                } else {
                    students = data.filter(user => user.userType === 'student')
                    faculty = data.filter(user => user.userType === 'faculty')
                    this.setState({
                        users: data,
                        students: students,
                        faculty: faculty,
                        done: true
                    });
                }
            });
    }

    componentDidMount() {
        this.init();
    }

    render() {
        const { redirectToSignin, users, done, students, faculty } = this.state
        if (redirectToSignin) return <Redirect to="/signin" />

        return (
            <> {
                !users ?
                    <Loading done={done} /> :

                    <div className="section__dashboard">
                        <div class="content">
                            <Sidebar />
                            <main class="main-content">

                                <div className="container-fluid">
                                    <h2>USERS</h2>
                                    <nav className="dashboard__tabs">
                                        <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                            <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Students</a>
                                            <a class="nav-item nav-link" id="nav-removed-tab" data-toggle="tab" href="#nav-removed" role="tab" aria-controls="nav-removed" aria-selected="false">Faculty Members</a>
                                        </div>
                                    </nav>
                                    <div class="tab-content" id="nav-tabContent">
                                        <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                                            <div class="table-responsive">
                                                <table class="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Image</th>
                                                            <th>Fullname</th>
                                                            <th>Department</th>
                                                            <th>E-mail</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            students.map(user => (
                                                                <tr key={user._id}>
                                                                    <td> {user.bannerId}</td>
                                                                    <td>
                                                                        {
                                                                            user.photo !== undefined ?
                                                                                <img className="admin-users__photo"
                                                                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`} /> :
                                                                                <img className="admin-users__photo"
                                                                                    src={DefaultProfile} />
                                                                        }
                                                                    </td>
                                                                    <td>{`${user.fname} ${user.lname}`}</td>
                                                                    <td>{user.department}</td>
                                                                    <td>{user.email}</td>
                                                                    <td>
                                                                        <DeleteUser userId={user._id} />
                                                                    </td>
                                                                </tr>


                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="tab-pane fade" id="nav-removed" role="tabpanel" aria-labelledby="nav-profile-tab">
                                            <div class="table-responsive">
                                                <table class="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Image</th>
                                                            <th>Fullname</th>
                                                            <th>Department</th>
                                                            <th>E-mail</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            faculty.map(user => (
                                                                <tr key={user._id}>
                                                                    <td>
                                                                        {
                                                                            user.photo !== undefined ?
                                                                                <img className="admin-users__photo"
                                                                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`} /> :
                                                                                <img className="admin-users__photo"
                                                                                    src={DefaultProfile} />
                                                                        }
                                                                    </td>
                                                                    <td>{`${user.fname} ${user.lname}`}</td>
                                                                    <td>{user.department}</td>
                                                                    <td>{user.email}</td>
                                                                    <td>
                                                                        <DeleteUser userId={user._id} />
                                                                    </td>
                                                                </tr>


                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
            }
            </>





        );
    }

}

export default AdminUsers;
