import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from "react-router-dom";
import { getAdvisers, accept, remove } from "../adviser/apiAdviser";
import { create } from "../review/apiReview";
import { createProcess, read } from '../studentProcess/apiStudentProcess';
import '../css/profile.css';

class ProcessProfile extends Component {
    constructor() {
        super()
        this.state = {
            requests: [],
            studentProcess: [],
            redirectToSignin: false,
            redirectToReview: false,
            loading: false
        }
    }
    
    componentDidMount() {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        getAdvisers().then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({ requests: data});
            }
        });
        read(userId, token).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({ studentProcess: data});
            }
        });

    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return this.state != nextState;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.requests === prevState.requests) {
            getAdvisers()
            .then(data => {
                if(data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ requests: data});
                }
            });
            const userId = isAuthenticated().user._id
            const token = isAuthenticated().token
            const studentProcess = this.state.studentProcess
            const studentInfo = userId
            const data = { studentInfo }
            read(userId, token).then(data => {
            if(data.error) {
                console.log(data.error)
                } else {
                    this.setState({ studentProcess: data});
                }
            });
            if(studentProcess.length === 0) {
               createProcess(userId, token, data).then(data => {
                if (data.error) 
                    this.setState({ error: data.error });
                }) 
            }
        }
    }
    
    newReview = event => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        
        
        const studentId = isAuthenticated().user._id
        const token = isAuthenticated().token
        const review = { studentId }
        create(studentId, token, review).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ 
                    loading: false,
                    redirectToReview: true
                })   
            }
        });
    }
    
    render() {
        const { redirectToReview, requests, studentProcess } = this.state
        if(redirectToReview) return <Redirect to={`/user/${isAuthenticated().user._id}/new-review`} />
            
        return (
            <div className="container" >
        
                {  
                    studentProcess.map((process, i) => (
                        process.topic === false ?
                            <div className="form-group mt-5">
                                <Link 
                                    to={`/researches`} 
                                    className="my-5 btn btn-info mx-auto form-control"
                                >
                                        First, Please select your thesis topic!
                                </Link>
                            </div> 
                            : process.topic === false ? 
                            <div className="form-group mt-5">
                                <Link 
                                    to={`/user/${isAuthenticated().user._id}/thesis-form`} 
                                    className="my-5 btn btn-info mx-auto form-control disabled"
                                >
                                        First, Please select your thesis topic!
                                </Link>
                            </div>   
                            : ''
                    ))
                    
                }  
                
                <button 
                    onClick={ this.newReview }
                    className="my-5 btn btn-info mx-auto form-control"
                >
                    Create Literature Review
                </button>
                
            </div>
        );
    }
}

export default ProcessProfile