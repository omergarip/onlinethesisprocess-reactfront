import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';
import { isAuthenticated } from '../auth';
import { listFaculty } from '../user/apiUser';
import Moment from 'react-moment';
import moment from 'moment';
import { getCommitteeByStudentId, selectCommittee, updateDate, updateCommittee } from './apiCommittee';
import Loading from '../core/Loading'
import Student from './Student'
import "flatpickr/dist/themes/material_green.css";

import Flatpickr from "react-flatpickr";

class Committee extends Component {
    constructor() {
        super();
        this.state = {
            cId: '',
            users: [],
            members: [],
            added: '',
            done: undefined,
            date: new Date(),
            maxDate: undefined,
            presentationDate: undefined,
            presentationPlace: undefined,
            redirectToProfile: false
        };
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        let dates = []
        let minDate, maxDate;
        getCommitteeByStudentId(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    cId: data[0]._id,
                    members: data[0].members,
                    presentationDate: data[0].presentationDate,
                    presentationPlace: data[0].presentationPlace,
                    done: true
                });
                data[0].members.map(date => {
                    if (date.startDate || date.endDate) {
                        dates.push(date.startDate)
                        dates.push(date.endDate)
                    }
                })
                if (!dates) {
                    minDate = dates.reduce(function (a, b) { return a < b ? a : b; });
                    maxDate = dates.reduce(function (a, b) { return a > b ? a : b; });
                }

                listFaculty().then(data => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        this.setState({
                            users: data,
                            minDate: minDate,
                            maxDate: maxDate
                        });
                    }
                });
            }
        });

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.added !== prevState.added) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            getCommitteeByStudentId(userId, token).then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    this.setState({
                        cId: data[0]._id,
                        members: data[0].members,
                        presentationDate: data[0].presentationDate,
                        presentationPlace: data[0].presentationPlace,
                        done: true
                    });
                    listFaculty().then(data => {
                        if (data.error) {
                            console.log(data.error);
                        } else {
                            this.setState({ users: data });
                        }
                    });
                }
            });
        }
    }

    sendRequest = e => {
        e.preventDefault()
        const cId = this.state.cId;
        const token = isAuthenticated().token
        const memberId = e.target.name
        const status = 'Sent'
        const isApproved = false;
        const data = { memberId, status, isApproved }
        selectCommittee(cId, token, data).then(data => {
            if (data.error)
                console.log(data.error)
            else {
                this.setState({
                    added: memberId,
                    done: true
                })
            }
        })
    }

    cancelRequest = e => {
        e.preventDefault()
        const cId = this.state.cId;
        const token = isAuthenticated().token
        const mId = e.target.name
        updateCommittee(cId, token, mId).then(data => {
            if (data.error)
                console.log(data.error)
            else {
                this.setState({
                    added: mId,
                    done: true
                })
            }
        })
    }

    schedulePresentation = e => {
        e.preventDefault()
        const cId = this.state.cId;
        const token = isAuthenticated().token
        const presentationDate = this.state.date
        const data = { presentationDate }
        updateDate(cId, token, data).then(data => {
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

    calculateLength = members => {
        let filterMembers = members.filter(val => val.status === 'Approved')
        return filterMembers.length
    }

    removeDuplicates = (users, members) => {
        let membersId = members.map(member => member.memberId._id)
        let filteredUsers = users.filter(val => !membersId.includes(val._id));
        return filteredUsers
    }

    render() {
        const { users, members, done, presentationDate, presentationPlace, cId } = this.state

        const filteredUsers = this.removeDuplicates(users, members)
        const length = this.calculateLength(members)

        return (
            <>
                {!users ?
                    <Loading done={done} /> :
                    <section className="section__committee">
                        <div class="container-fluid">
                            {length >= 3 && !presentationDate ?
                                <>
                                    <h2>Schedule Presentation</h2>
                                    <div className="container d-flex justify-content-center">
                                        <Flatpickr
                                            placeholder='Please select a date'
                                            data-enable-time
                                            options={{
                                                dateFormat: "m/d/Y H:i",
                                                defaultDate: "",
                                                disableMobile: "true",
                                                minDate: this.state.minDate,
                                                maxDate: this.state.maxDate
                                            }}
                                            onChange={(selectedDates, dateStr, instance) => {
                                                this.setState({ date: dateStr });
                                            }}
                                        />
                                        <button className="btn btn-info"
                                            onClick={this.schedulePresentation}>
                                            Schedule Presentation
                                        </button>
                                    </div>
                                </>
                                : presentationDate ?
                                    <>
                                        <h2>Scheduled Presentation</h2>
                                        <p className='text-center'>Your thesis presentation is scheduled on <Moment format='LLLL' date={presentationDate} /></p>
                                        {presentationPlace ?
                                            <p className='text-center'>Presentation place is {presentationPlace}</p> :
                                            <p className='text-center'>Presentation place will be assigned by Department Administrator. You will be notified and can see the place in this page once it is assigned</p>
                                        }
                                    </>
                                    : null
                            }

                            <h2>Committee Members</h2>
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>

                                        <th>Image</th>
                                        <th>Fullname</th>
                                        <th>Department</th>
                                        <th>Email</th>
                                        <th>Action</th>
                                    </thead>
                                    <tbody>
                                        {members.map((user, i) => (
                                            <tr>
                                                <td>
                                                    <img
                                                        style={{ height: '8rem' }}
                                                        className="img-thumbnail"
                                                        src={`${process.env.REACT_APP_API_URL}/user/photo/${user.memberId._id}?
                                     ${new Date().getTime()}`}
                                                        onError={i => (i.target.src = `${DefaultProfile}`)}
                                                        alt={`${user.memberId.fname} ${user.memberId.lname}`}
                                                    />
                                                </td>
                                                <td>
                                                    <h3>{`${user.memberId.fname} ${user.memberId.lname} `}</h3>

                                                </td>
                                                <td>{user.memberId.department}</td>
                                                <td>
                                                    <a
                                                        href={`mailto:${user.memberId.email}`}
                                                    >
                                                        {user.memberId.email}
                                                    </a>
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/user/${user._id}`}
                                                        className="btn btn-raised btn-primary"
                                                    >
                                                        View Profile
                                             </Link>
                                                    {user.status === 'Sent' ?
                                                        <>
                                                            <button
                                                                onClick={this.sendRequest}
                                                                className="disabled btn btn-raised btn-info ml-3"
                                                            >
                                                                Waiting for approval
                                                            </button>
                                                            <a
                                                                name={user._id}
                                                                onClick={this.cancelRequest}
                                                                id="cancelPermission"
                                                                className={user.memberId._id}>
                                                                Click here to cancel it
                                                            </a>
                                                        </>
                                                        : null

                                                    }

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                        {
                            !presentationDate && isAuthenticated().user.userType !== 'faculty' ?
                                <div class="container-fluid">
                                    <h2>Faculty Members</h2>
                                    <div class="table-responsive">
                                        <table class="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Fullname</th>
                                                    <th>Department</th>
                                                    <th>Email</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredUsers.map((user, i) => (
                                                    <tr>
                                                        <td>
                                                            <img
                                                                style={{ height: '8rem' }}
                                                                className="img-thumbnail"
                                                                src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}?
                                     ${new Date().getTime()}`}
                                                                onError={i => (i.target.src = `${DefaultProfile}`)}
                                                                alt={`${user.fname} ${user.lname}`}
                                                            />
                                                        </td>
                                                        <td>
                                                            <h3>{`${user.fname} ${user.lname} `}</h3>

                                                        </td>
                                                        <td>{user.department}</td>
                                                        <td>
                                                            <a
                                                                href={`mailto:${user.email}`}
                                                            >
                                                                {user.email}
                                                            </a>
                                                        </td>
                                                        <td>
                                                            <Link
                                                                to={`/user/${user._id}`}
                                                                className="btn btn-raised btn-primary"
                                                            >
                                                                View Profile
                                             </Link>
                                                            <button
                                                                name={user._id}
                                                                onClick={this.sendRequest}
                                                                className="btn btn-raised btn-info ml-3"
                                                            >
                                                                Send Request
                                             </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                : null
                        }

                    </section>
                }

            </>
        );
    }
};

export default Committee;
