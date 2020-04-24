import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { getProcessByUserId } from '../process/apiProcess'
import { acceptCommittee, getCommitteeMembers, updateDate, updateCommittee } from './apiCommittee';
import { listFaculty } from '../user/apiUser';
import DefaultProfile from '../images/avatar.png';
import DatePicker from '../js/DatePicker'
import Flatpickr from "react-flatpickr";
import rangePlugin from "flatpickr/dist/plugins/rangePlugin";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import Moment from 'react-moment';
import Countdown from 'react-countdown-now';

class CommitteeMember extends Component {
    constructor() {
        super();
        this.state = {
            cId: '',
            mId: '',
            users: [],
            members: [],
            committee: [],
            done: undefined,
            date: new Date(),
            startDate: undefined,
            endDate: undefined,
            diff: undefined,
            presentationDate: undefined,
            presentationPlace: undefined,
            redirectToProfile: false
        };
    }

    componentDidMount() {
        const token = isAuthenticated().token;
        getCommitteeMembers(token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    committee: data,
                    done: true
                });
                let members = []
                data.map(d =>
                    d.members.forEach(a => members.push(a)))
                listFaculty().then(data => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        this.setState({
                            users: data,
                            members: members
                        });
                    }
                });
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.added !== prevState.added) {
            const token = isAuthenticated().token;
            getCommitteeMembers(token).then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    this.setState({
                        committee: data,
                        done: true
                    });
                    let members = []
                    data.map(d =>
                        d.members.forEach(a => members.push(a)))
                    listFaculty().then(data => {
                        if (data.error) {
                            console.log(data.error);
                        } else {
                            this.setState({
                                users: data,
                                members: members
                            });
                        }
                    });
                }
            });
        }
    }

    approveWork = e => {
        e.preventDefault()
        const cId = this.state.cId
        const token = isAuthenticated().token
        const memberId = isAuthenticated().user._id
        const status = 'Approved'
        const isApproved = true;
        const members = { memberId, status, isApproved }
        acceptCommittee(cId, token, memberId, members).then(data => {
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

    acceptRequest = e => {
        e.preventDefault()
        const cId = e.target.id;
        const token = isAuthenticated().token
        const { startDate, endDate } = this.state;
        const memberId = isAuthenticated().user._id
        const status = 'Approved'
        const members = { memberId, status, startDate, endDate }
        console.log(members)
        acceptCommittee(cId, token, memberId, members).then(data => {
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

    cancelRequest = e => {
        e.preventDefault()
        const cId = e.target.id;
        const token = isAuthenticated().token
        const { members, committee } = this.state;
        const mId = this.findCId(committee, members, isAuthenticated().user._id)
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

    viewThesis = e => {
        e.preventDefault();
        const userId = e.target.name
        const token = isAuthenticated().token
        getProcessByUserId(userId, token).then(data => {
            if (data.error)
                console.log(data.error)
            else {
                console.log(data[0]._id, data[0].thesisId)
                window.location = `/thesis-process/${data[0]._id}/thesis/${data[0].thesisId}/chapters`
            }
        })
    }

    findCId = (users, members, userId) => {
        let membersId = members.map(member => {
            if (member.memberId._id === userId)
                return member
        })
        let m = []
        let filteredUsers = []
        let mId = ''
        if (membersId.length > 1) {
            m = membersId.filter(member => member !== undefined)
        }
        if (m[0] === undefined)
            return m[0]
        else {
            users.map(val => val.members.map(a => {
                if (m.includes(a) && a.status === 'Sent') {
                    filteredUsers.push(val)
                    mId = a._id
                }


            }));
        }
        return mId
    }



    removeDuplicates = (users, members, userId) => {
        let membersId = members.map(member => {
            if (member.memberId._id === userId)
                return member
        })
        let m = []
        let filteredUsers = []
        let mId = ''
        if (membersId.length > 1) {
            m = membersId.filter(member => member !== undefined)
        }
        if (m[0] === undefined)
            return m[0]
        else {
            users.map(val => val.members.map(a => {
                if (m.includes(a) && a.status === 'Sent') {
                    filteredUsers.push(val)
                    mId = a._id
                }


            }));
        }
        return filteredUsers
    }

    acceptedRequests = (users, members, userId) => {
        let membersId = members.map(member => {
            if (member.memberId._id === userId)
                return member
        })
        let m = []
        let filteredUsers = []
        let mId = ''
        if (membersId.length > 1) {
            m = membersId.filter(member => member !== undefined)
        }
        if (m[0] === undefined)
            return m[0]
        else {
            users.map(val => val.members.map(a => {
                if (m.includes(a) && a.status === 'Approved' && !a.isApproved) {
                    filteredUsers.push(val)
                    mId = a._id
                }


            }));
        }
        return filteredUsers
    }


    render() {
        const { members, committee } = this.state;
        const Completionist = () => <button onClick={this.approveWork} className='btn btn-info rounded'>Accept Study</button>
        // Renderer callback with condition
        const renderer = ({ days, hours, minutes, seconds, completed }) => {
            if (completed) {
                // Render a completed state
                return <Completionist />;
            } else {
                // Render a countdown
                return <span>{days} days, {hours}:{minutes}:{seconds}</span>;
            }
        };


        const cmembers = this.removeDuplicates(committee, members, isAuthenticated().user._id)

        const accepted = this.acceptedRequests(committee, members, isAuthenticated().user._id)


        return (
            <>
                <section className="section__committee">
                    <>
                        <h2>Student Requests</h2>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>

                                    <th>Image</th>
                                    <th>Fullname</th>
                                    <th>Department</th>
                                    <th>Email</th>
                                    <th>Thesis</th>
                                    <th>Action</th>
                                </thead>
                                <tbody>
                                    {
                                        cmembers !== undefined ?
                                            cmembers.map((user, i) => (
                                                <tr>
                                                    <td>
                                                        <img
                                                            style={{ height: '8rem' }}
                                                            className="img-thumbnail"
                                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${user.studentId._id}?
                                            ${new Date().getTime()}`}
                                                            onError={i => (i.target.src = `${DefaultProfile}`)}
                                                            alt={`${user.studentId.fname} ${user.studentId.lname}`}
                                                        />
                                                    </td>
                                                    <td>
                                                        <h3>{`${user.studentId.fname} ${user.studentId.lname} `}</h3>

                                                    </td>
                                                    <td>{user.studentId.department}</td>
                                                    <td>
                                                        <a
                                                            href={`mailto:${user.studentId.email}`}
                                                        >
                                                            {user.studentId.email}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={this.viewThesis}
                                                            name={user.studentId._id}
                                                            className="btn btn-raised btn-primary"
                                                        >
                                                            View Thesis
                                                    </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            data-toggle="modal" data-target="#selectDates"

                                                            className="btn btn-success btn-sm mr-1"
                                                        >
                                                            Accept
                                                    </button>
                                                        <div class="modal fade" id="selectDates" tabindex="-1" role="dialog" aria-labelledby="selectDatesLabel" aria-hidden="true">
                                                            <div class="modal-dialog" role="document">
                                                                <div class="modal-content">
                                                                    <div class="modal-header">
                                                                        <h5 class="modal-title" id="selectDatesLabel">Modal title</h5>
                                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                            <span aria-hidden="true">&times;</span>
                                                                        </button>
                                                                    </div>
                                                                    <div class="modal-body">
                                                                        <div className="d-flex ">
                                                                            <Flatpickr
                                                                                placeholder='Please select a date'
                                                                                data-enable-time
                                                                                options={{
                                                                                    dateFormat: "m/d/Y H:i",
                                                                                    defaultDate: "",
                                                                                    disableMobile: "true",
                                                                                    minDate: "today"
                                                                                }}
                                                                                onChange={(selectedDates, dateStr, instance) => {
                                                                                    this.setState({ startDate: dateStr });
                                                                                }}
                                                                            />
                                                                            <Flatpickr
                                                                                placeholder='Please select a date'
                                                                                data-enable-time
                                                                                options={{
                                                                                    dateFormat: "m/d/Y H:i",
                                                                                    defaultDate: "",
                                                                                    disableMobile: "true",
                                                                                    minDate: this.state.startDate
                                                                                }}
                                                                                onChange={(selectedDates, dateStr, instance) => {
                                                                                    this.setState({ endDate: dateStr });
                                                                                }}
                                                                            />
                                                                        </div>


                                                                    </div>
                                                                    <div class="modal-footer">
                                                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                                        <button type="button" class="btn btn-primary" id={user._id}
                                                                            onClick={this.acceptRequest}>Save Date Ranges</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            id={user._id}
                                                            name={user.members._id}
                                                            onClick={this.cancelRequest}
                                                            className="btn btn-danger btn-sm"
                                                        >
                                                            Reject
                                                    </button>
                                                    </td>
                                                </tr>
                                            )) : null}
                                </tbody>
                            </table>
                        </div>
                        <h2>Accepted Requests</h2>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>

                                    <th>Image</th>
                                    <th>Fullname</th>
                                    <th>Department</th>
                                    <th>Email</th>
                                    <th>Thesis</th>
                                    <th>Date</th>
                                    <th>Place</th>
                                    <th>Action</th>
                                </thead>
                                <tbody>
                                    {
                                        accepted !== undefined ?
                                            accepted.map((user, i) => (
                                                <tr>
                                                    <td>
                                                        <img
                                                            style={{ height: '8rem' }}
                                                            className="img-thumbnail"
                                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${user.studentId._id}?
                                            ${new Date().getTime()}`}
                                                            onError={i => (i.target.src = `${DefaultProfile}`)}
                                                            alt={`${user.studentId.fname} ${user.studentId.lname}`}
                                                        />
                                                    </td>
                                                    <td>
                                                        <h3>{`${user.studentId.fname} ${user.studentId.lname} `}</h3>

                                                    </td>
                                                    <td>{user.studentId.department}</td>
                                                    <td>
                                                        <a
                                                            href={`mailto:${user.studentId.email}`}
                                                        >
                                                            {user.studentId.email}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={this.viewThesis}
                                                            name={user.studentId._id}
                                                            className="btn btn-raised btn-primary"
                                                        >
                                                            View Thesis
                                                    </button>
                                                    </td>
                                                    <td>
                                                        {user.presentationDate ?
                                                            <Moment format='LLLL' date={user.presentationDate} /> :
                                                            <p>Not Scheduled</p>
                                                        }
                                                    </td>
                                                    <td>
                                                        {user.presentationPlace ?
                                                            <p>{user.presentationPlace}</p> :
                                                            <p>Not Assigned</p>
                                                        }

                                                    </td>
                                                    <td>
                                                        <Countdown
                                                            date={Date.now() + 2000}
                                                            renderer={renderer}
                                                            onStart={e => this.setState({ cId: user._id })}
                                                        />

                                                    </td>
                                                </tr>
                                            )) : null}
                                </tbody>
                            </table>
                        </div>
                    </>

                </section>

            </>
        );
    }
};

export default CommitteeMember;