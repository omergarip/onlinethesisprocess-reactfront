import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';

class ListMembers extends Component {
    
	render() {
        const { users } = this.props;
        
		return (
            <>
            {
                users.length > 0 ? (
                    <>
                    <div className="department__info">
                        <p>{ users[0].department }</p>	
                    </div>
                    <div className="row">
                        
                        {users.map((user, i) => (
                            <div className="col-md-3 col-sm-6" key={i}>
                                
                                <div className="our-team" style={{ minHeight: '367px' }}>
                                    <div className="pic">
                                        <img
                                            style={{ minHeight: '130px' }}
                                            className="img-thumbnail"
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}?
                                            ${new Date().getTime()}`}
                                            onError={i => (i.target.src = `${DefaultProfile}`)}
                                            alt={`${user.fname} ${user.lname}`}
                                        />
                                    </div>
                                    <div className="team-content">
                                        <h3>{`${user.fname} ${user.lname} `}</h3>
                                        <a
                                            href={`mailto:${user.email}`}
                                        >
                                            {user.email}
                                        </a>
                                    </div>
                                    <ul className="social">
                                        <Link
                                            id="home__members-btn"
                                            to={`/user/${user._id}`}
                                            className="btn btn-raised btn-primary btn-sm"
                                        >
                                            View Profile
                                        </Link>
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link
                        className="float-right"
                        style={{ fontSize: "2rem"}}
                        to={`/user`}
                    >
                        Click here to see more.
                    </Link>
                    <hr/>
                    </>
                ) : ''
            }
            </>
		);
    }
};

export default ListMembers;
