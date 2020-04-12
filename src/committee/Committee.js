import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';
import { isAuthenticated } from '../auth';
import { listFaculty } from '../user/apiUser';
import { getCommittee, createCommittee } from './apiCommittee';

class Committee extends Component {
    constructor() {
		super();
		this.state = {
            users: [],
            cMembers: [],
            redirectToProfile: false
		};
	}

	componentDidMount() {
		const cMemberId = this.props.match.params.cMemberId;
		const token = isAuthenticated().token;
		getCommittee(cMemberId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
                    this.setState({ 
                        cMembers: data.cMemberId,    
                        loading: false
                    });	
			}
        });
        listFaculty().then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ users: data });
			}
        });
    }

    removeDuplicates(users, cMembers) {

    }

	render() {   
        const { users, cMembers } = this.state

        this.removeDuplicates(users, cMembers)
		return (
            <>
            <section className="section__committee">
               <div class="container">
                <h2>Committee Members</h2>        
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>

                            <th>Image</th>
                            <th>Fullname</th>
                            <th>Email</th>
                            <th>Action</th>
                        </thead>
                        <tbody>
                        { cMembers.map((user, i) => (
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
                                    <Link
                                        to={`/user/${user._id}`}
                                        className="btn btn-raised btn-primary ml-3"
                                    >
                                        Choose
                                    </Link>
                                </td>
                            </tr>        
                        ))}
                        </tbody>
                    </table>
                </div>
            </div> 
            <div class="container">
                <h2>Faculty Members</h2>        
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>Fullname</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        { users.map((user, i) => (
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
                                    <Link
                                        to={`/user/${user._id}`}
                                        className="btn btn-raised btn-primary ml-3"
                                    >
                                        Choose
                                    </Link>
                                </td>
                            </tr>        
                        ))}
                        </tbody>
                    </table>
                </div>
            </div> 
            </section>
            
            </>
		);
    }
};

export default Committee;
