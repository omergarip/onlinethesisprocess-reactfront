import React, { Component } from "react";
import { getResearch } from "./apiResearch";
import { read } from "../user/apiUser";
import { create, check } from "../process/apiProcess";
import { isAuthenticated } from "../auth";
import '../css/main.css';
import { Link } from 'react-router-dom';

class ShowResearch extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            user: "",
            research: "",
            createdBy: "",
            thesis: [],
        };
    }
    
    componentDidMount() {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        const researchId = this.props.match.params.rId
        check(userId, token).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({ thesis: data });
            }
        });
        getResearch(researchId, token).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({ research: data, createdBy: data.createdBy });
            }
        });
        read(userId, token).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({ user: data });
            }
        });
        console.log(this.state.research)
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return this.state != nextState;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        if (this.state.permissions === prevState.permissions) {
            check(userId, token).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({ thesis: data });
            }
        });
        }
    }

    
    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });
        const studentInfo = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const process = {
            studentInfo
        };
        create(studentInfo, token, process).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ 
                    loading: false
                })    
            }
        });
    };
    
    renderPosts = (research, createdBy, thesis, user) => (
        <div className="row">
            <div className="card mt-5">
                <h5 class="card-header">{ research.title }</h5>
                <div class="card-body">
                    <p class="card-text">
                        { research.body }
                    </p>
                    <p class="float-right"> 
                            <strong>Submitted By: { createdBy.fname } { createdBy.lname}</strong><br/>
                            <strong>Department: { createdBy.department } </strong><br/>
                            <strong>Email: { createdBy.email } </strong>
                   </p>
                <br/><br/><br/>  
                
                { thesis.length === 0 ? 
                    <button 
                        onClick={this.clickSubmit}
                        className="btn btn-info"
                    > 
                    Select This Topic 
                    </button> : 
                    thesis.map((data, i) => (
                    data.studentInfo._id === user._id ?
                   <button 
                        onClick={this.clickSubmit}
                        className="btn btn-info"
                    > 
                    Select This Topic 
                    </button> :
                    <div>
                        <p className="text-primary"> 
                        You have selected this topic for your thesis. Now, you can select your adviser.
                        </p>
                        <Link className="btn btn-primary"  to="/faculty-members">
                            Select Adviser
                        </Link>
                    </div>
                    
                   
                ))} 
                
                </div>
                
                <div class="card-footer text-muted text-center">
                    <p class="card-text">
                        {new Date(
                                research.created
                            ).toDateString()}
                    </p>
                </div>
            </div> 
        </div>
    );
    render() {
        const { research, createdBy, thesis, user } = this.state;
        
        return (
            <div className="container">
                { this.renderPosts(research, createdBy, thesis, user) }
            </div>
            );
    }
}

export default ShowResearch