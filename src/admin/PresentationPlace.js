import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { getCommitteeMembers, getCommitteeByStudentId, updateDate } from '../committee/apiCommittee'
import { list } from "../user/apiUser";
import DefaultProfile from '../images/avatar.png';
import Loading from '../core/Loading';
import DeleteUser from '../user/DeleteUser';
import Sidebar from './Sidebar';
import Moment from 'react-moment';
import { isAuthenticated } from '../auth';


class PresentationPlace extends Component {
    constructor() {
        super()
        this.state = {
            data: [],
            done: undefined,
            assigned: [],
            notAssigned: [],
            presentationPlace: "",
            added: undefined,
            redirectToSignin: false
        }
    }

    init = () => {
        let assigned = []
        let notAssigned = []
        const token = isAuthenticated().token
        getCommitteeMembers(token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToSignin: true });
                } else {
                    assigned = data.filter(place => place.presentationPlace !== undefined)
                    notAssigned = data.filter(place => place.presentationPlace === undefined)
                    this.setState({
                        data: data,
                        assigned: assigned,
                        notAssigned: notAssigned,
                        done: true
                    });
                }
            });
    }

    componentDidMount() {
        this.init();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.added !== this.state.added)
            this.init();
    }

    handleChange = (name) => event => {
        this.setState({ error: "" });
        this.setState({
            [name]: event.target.value
        });
    };

    assignRoom = e => {
        e.preventDefault()
        const userId = e.target.id;
        const token = isAuthenticated().token
        const presentationPlace = this.state.presentationPlace
        const cData = { presentationPlace }
        getCommitteeByStudentId(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                const cId = data[0]._id
                updateDate(cId, token, cData).then(data => {
                    if (data.error)
                        console.log(data.error)
                    else {
                        this.setState({
                            added: cId,
                            done: true
                        })
                    }
                })
            }
        })
    }

    render() {
        const { redirectToSignin, data, done, assigned, notAssigned } = this.state
        if (redirectToSignin) return <Redirect to="/signin" />


        const isActive = (history, path) => {
            if (window.location.pathname === path) return true
            else return false
        }

        return (
            <> {
                !data ?
                    <Loading done={done} /> :

                    <div className="section__dashboard">
                        <div class="content">
                            <Sidebar />
                            <main class="main-content">

                                <div className="container-fluid">
                                    <h2>Assign a Room for Presentation</h2>
                                    <nav className="dashboard__tabs">
                                        <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                            <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab"
                                                href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Assign Room</a>
                                            <a class="nav-item nav-link" id="nav-removed-tab" data-toggle="tab"
                                                href="#nav-removed" role="tab" aria-controls="nav-removed" aria-selected="false">Change Room</a>
                                        </div>
                                    </nav>
                                    <div class="tab-content" id="nav-tabContent">
                                        <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                                            <div class="table-responsive">
                                                <table class="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Fullname</th>
                                                            <th>Department</th>
                                                            <th>E-mail</th>
                                                            <th>Presentation Date</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            notAssigned.map(user => (
                                                                <tr key={user.studentId._id}>
                                                                    <td> {user.studentId.bannerId}</td>

                                                                    <td>{`${user.studentId.fname} ${user.studentId.lname}`}</td>
                                                                    <td>{user.studentId.department}</td>
                                                                    <td>{user.studentId.email}</td>
                                                                    <td><Moment format='LLLL' date={user.presentationDate} /></td>
                                                                    <td>
                                                                        <form className="flex-column d-flex justifiy-content-center">
                                                                            <input required className="form-control mb-2"
                                                                                onChange={this.handleChange("presentationPlace")}
                                                                            />
                                                                            <button className="btn btn-info"
                                                                                id={user.studentId._id}
                                                                                onClick={this.assignRoom}>
                                                                                Assign Room
                                                                        </button>
                                                                        </form>

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
                                                            <th>ID</th>
                                                            <th>Fullname</th>
                                                            <th>Department</th>
                                                            <th>E-mail</th>
                                                            <th>Presentation Date</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            assigned.map(user => (

                                                                <tr key={user.studentId._id}>
                                                                    <td> {user.studentId.bannerId}</td>
                                                                    <td>{`${user.studentId.fname} ${user.studentId.lname}`}</td>
                                                                    <td>{user.studentId.department}</td>
                                                                    <td>{user.studentId.email}</td>
                                                                    <td><Moment format='LLLL' date={user.presentationDate} /></td>
                                                                    <td>
                                                                        <form className="flex-column d-flex justifiy-content-center">
                                                                            <input required className="form-control mb-2"
                                                                                value={this.state.presentationPlace || user.presentationPlace}
                                                                                onChange={this.handleChange("presentationPlace")}
                                                                                onStart={e => this.setState({ presentationPlace: user.presentationPlace })}
                                                                            />
                                                                            <button className="btn btn-info"
                                                                                id={user.studentId._id}
                                                                                onClick={this.assignRoom}>
                                                                                Change Room
                                                                        </button>
                                                                        </form>

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

export default PresentationPlace;
