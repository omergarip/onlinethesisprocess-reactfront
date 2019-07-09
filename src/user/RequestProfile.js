import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from "react-router-dom";
import { read, createProcess, deleteProcess } from '../studentProcess/apiStudentProcess';
import { getRequestsByUser, accept, remove } from "../adviser/apiAdviser";
import '../css/profile.css';

class RequestProfile extends Component {
    constructor() {
        super()
        this.state = {
            requests: [],
            studentId: '',
            redirectToSignin: false,
            studentProcess: []
        }
    }
    
    componentDidMount() {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        getRequestsByUser(userId, token)
        .then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({ 
                    requests: data,
                    studentId: data[0].requestedFrom._id
                });
            }
        });
        console.log(this.state.requests)
        read(userId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ studentProcess: data });
			}
		});
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return this.state != nextState;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        const studentId = this.state.studentId
        if (this.state.requests === prevState.requests) {
            
            getRequestsByUser(userId, token)
            .then(data => {
                if(data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ requests: data});
                }
            });
            read(studentId, token).then(data => {
    			if (data.error) {
    				console.log(data.error);
    			} else {
    				this.setState({ studentProcess: data });
    			}
    		});
        }
    }
    
    acceptRequest = event => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        this.state.requests[event.target.id].status = 'Accepted'
        this.forceUpdate()
        const requestId = this.state.requests[event.target.id]._id;
        const token = isAuthenticated().token;
        const request = this.state.requests[event.target.id]
        accept(requestId, token, request).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ 
                    loading: false
                })    
            }
        });
        const userId = isAuthenticated().user._id;
		const pId = this.state.studentProcess[0]._id;
		const topic = this.state.studentProcess[0].topic._id;
		const topicStatus = true;
		const studentInfo = this.state.studentProcess[0].studentInfo._id;
		const adviser = isAuthenticated().user._id;
		const adviserStatus = true;
		const data = {
			studentInfo, topic, topicStatus, adviser, adviserStatus
		};
		console.log(data)
		deleteProcess(userId, token, pId).then(data => {
			if (data.error) {
				this.setState({ error: data.error });
			} else {
				this.setState({
					loading: false
				});
			}
		});
		createProcess(userId, token, data).then(data => {
			if (data.error) {
				this.setState({ error: data.error })
			}
			else {
				this.setState({
					loading: false
				});
			}
		})
    };
    
    rejectRequest = event => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        const requestId = this.state.requests[event.target.id]._id;
        const token = isAuthenticated().token;
        remove(requestId, token).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ 
                    loading: false
                })    
            }
        });
        
    };
    
    render() {
        const { redirectToSignin, requests } = this.state
        if(redirectToSignin) return <Redirect to="/signin" />
            
        return (
            <div class="container main-secction mt-5" >
        
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
                    { requests.map((request, i) => (
                         request.status === 'Waiting for permission' ?
                      <tr key={ i }>
                        <td>{ `${request.requestedFrom.fname} ${request.requestedFrom.lname}` }</td>
                        <td>{ request.requestedFrom.department }</td>
                        <td>{ request.requestedFrom.bannerId }</td>
                        <td>{ request.requestedFrom.email }</td>
                        <td>{ request.introduction }</td>
                        <td>{ request.message }</td>
                        <td>
                            <button
                                id={ i }
                                onClick={ this.acceptRequest }
                                className="btn btn-success btn-sm mr-1"
                            >
                                Accept
                            </button>
                            <button
                                id={ i }
                                onClick={ this.rejectRequest }
                                className="btn btn-danger btn-sm"
                            >
                                Reject
                            </button>
                        </td>
                      </tr> : ''
                      ))}
                    </tbody>
                </table>  
                <hr/>
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
                    { requests.map((request, i) => (
                         request.status === 'Accepted' ?
                      <tr key={ i }>
                        <td>{ `${request.requestedFrom.fname} ${request.requestedFrom.lname}` }</td>
                        <td>{ request.requestedFrom.department }</td>
                        <td>{ request.requestedFrom.bannerId }</td>
                        <td>{ request.requestedFrom.email }</td>
                      </tr> : ''
                      ))}
                    </tbody>
                </table>  
                 
                
            </div>
        );
    }
}

export default RequestProfile