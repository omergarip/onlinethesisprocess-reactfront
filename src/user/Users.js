import React, { Component } from "react";
import { list } from "./apiUser";
import DefaultProfile from '../images/avatar.png';
import { Link } from 'react-router-dom';
import '../css/faculty.css'

class Users extends Component {
    constructor() {
        super();
        this.state = {
            users: []
        };
    }
    
    componentDidMount() {
        list().then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({ users: data });
                console.log(data);
            }
        });
    }
    
    renderUsers = users => (
        
        <div className="row">
            { users.map((user, i) => (
                <div className="col-md-3 col-sm-6"  key={ i }>
                    <div className="our-team" >
                        <div className="pic">
                            <img 
                                style={{ minHeight: "130px" }}
                                className="img-thumbnail"
                                src={ `https://onlinethesisprocess-omergarip.c9users.io/user/photo/${user._id}?
                                ${new Date().getTime()}` } 
                                onError={ i => (i.target.src = `${DefaultProfile}`)}
                                alt={ `${user.fname} ${user.lname}` } 
                            />
                        </div>
                        <div className="team-content">
                            <h3>{ `${user.fname} ` }</h3>
                            <span className="post"> { user.department } </span>
                        </div>
                        <ul className="social">
                            <Link 
                                to={`/user/${user._id}`}
                                className="btn btn-raised btn-primary btn-sm">
                                View Profile
                            </Link>
                        </ul>
                    </div>
                    
                </div>
            
            ))}
            </div>
    
    );
    render() {
        const { users } = this.state;
        
        return (

                <div className="container">
                    <div className="col-md-12 text-center">
                        <h1>Faculty Members</h1>
                    </div>
            
                    { this.renderUsers(users) }
                    
                </div>
            );
    }
}

export default Users;