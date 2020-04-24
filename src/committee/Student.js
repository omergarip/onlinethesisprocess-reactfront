import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { getCommitteeByStudentId, selectCommittee, updateDate, updateCommittee } from './apiCommittee';
import { listFaculty } from '../user/apiUser';
import DefaultProfile from '../images/avatar.png';

class Student extends Component {
    constructor() {
        super();
        this.state = {
            cId: '',
            users: [],
            members: [],
            added: '',
            done: undefined,
            date: new Date(),
            presentationDate: undefined,
            presentationPlace: undefined,
            redirectToProfile: false
        };
    }

    componentDidMount() {
        const userId = this.props.studentId
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

    render() {
        const { members } = this.state;

        return (
            <>


            </>
        );
    }
};

export default Student;