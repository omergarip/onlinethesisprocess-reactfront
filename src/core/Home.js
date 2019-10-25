import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { listFaculty } from '../user/apiUser';
import { list } from "../research/apiResearch";
import { getPermissions, create, remove  } from "../permission/apiPermission";
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';
import '../css/app.css';
import '../css/queries.css';
import '../css/normalize.css';
import '../css/animate.css';

class Home extends Component {
	constructor() {
		super();
		this.state = {
            researchId: "",
            researches: [],
            permissions: [],
            users: [],
            deleted: false,
		};
	}

	componentDidMount() {
        if (isAuthenticated())
        {
            const userId = isAuthenticated().user._id
            getPermissions(userId).then(data => {
                if(data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ permissions: data });
                }
            });
        }
        listFaculty().then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ users: data });
			}
		});    
        list().then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({ researches: data });
            }
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state != nextState;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.permissions === prevState.permissions) {
            if (isAuthenticated())
            {
                const userId = isAuthenticated().user._id
                getPermissions(userId).then(data => {
                    if(data.error) {
                        console.log(data.error)
                    } else {
                        this.setState({ permissions: data });
                    }
                });
            }
        }
    }

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });
        const permissionFrom = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const permissionFor = event.target.id
        const permissionTo = event.target.name;
        const permission = {
            permissionFrom, permissionTo, permissionFor 
        };
        create(permissionFor, token, permission).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ 
                    loading: false
                })    
            }
        });
    };
    
    cancelPermission = event => {
        event.preventDefault();
        this.setState({ loading: true });
        const permissionId = this.state.permissions[event.target.name]._id
        const token = isAuthenticated().token;
        remove(permissionId, token).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ 
                    loading: false,
                    permissions: []
                })    
            }
        });
    };

    renderPosts = (recentResearches) => (  
        <div className="row js--wp-1">
            { isAuthenticated() && (
                recentResearches.map((research, i) => (
                                
                    <div className="col-md-6 d-flex align-items-stretch">
                        <div className="card card-default">
                            <div className="card-header">
                                { research.title }
                            </div>
                            <div className="card-body">
                                <p className="card-text">
                                    { research.description }
                                </p> 
                                <hr id="seperator" />
                                <div className="researcher__info">
                                    <p className="">
                                        <strong>Submitted By: </strong> 
                                        <a href={`/user/${research.createdBy._id}`}>
                                            <img src={ `${process.env.REACT_APP_API_URL}/user/photo/${research.createdBy._id}?${new Date().getTime()}`  } 
                                                alt={ `${research.createdBy.fname} ${research.createdBy.lname}` } 
                                                className="home-profile" 
                                            />
                                            { `${research.createdBy.fname} ${research.createdBy.lname}` } 
                                        </a>
                                    </p>
                                    <p className="home__dep">
                                        <strong>Department:</strong> {research.createdBy.department } 
                                    </p>
                                    { isAuthenticated().user._id === research.createdBy._id ?
                            <Link 
                                key={ i }
                                to={`/research/${research._id}`}
                                className="btn btn-raised btn-primary btn-sm float-right">
                                    Read More 
                            </Link>  : ''
                        }
                        
                        { isAuthenticated().user.userType === 'student' && this.state.permissions.length === 0 ? 
                            <button
                                id={ research._id }
                                name= { research.createdBy._id }
                                onClick={this.clickSubmit}
                                className="btn btn-raised btn-primary btn-sm float-right"> 
                                    Ask Permission To Read
                            </button> : this.state.permissions.map((permission, i) =>(
                            isAuthenticated().user.userType === 'student' ? (
                                permission.permissionFrom === isAuthenticated().user._id  ? (
                                    permission.status === 'Accepted'
                                    && permission.permissionFor === research._id ?
                                    <Link 
                                            key={ i }
                                            to={`/research/${research._id}`}
                                            className="btn btn-raised btn-primary btn-sm float-right">
                                                Read More
                                        </Link> 
                                    : permission.status === 'Waiting for permission' 
                                    && permission.permissionFor === research._id? 
                                        <div className="form-group float-right"  key={ i }> 
                                            <button 
                                                id="waitingPermission"
                                                className="form-control btn btn-raised btn-warning btn-sm disabled">
                                                    Waiting for permission 
                                            </button>
                                            <a 
                                                name = { i }
                                                onClick={this.cancelPermission}
                                                id="cancelPermission"
                                                className="">
                                                    Click here to cancel it
                                            </a> 
                                        </div> : '') :''
                                        
                                        
                                        
                                    
                                ) : <button
                                        id={ research._id }
                                        onClick={this.clickSubmit}
                                        className="btn btn-raised btn-primary btn-sm float-right"> 
                                            Ask Permission To Read
                                    </button>
                                
                        ) ) }
                                </div>  
                            </div>
                            <div className="card-footer">
                                <Moment parse="YYYY-MM-DD HH:mm" fromNow> { research.created }</Moment>
                            </div>
                        </div>
                    </div>  
                ) )
            )  }  
        </div>
    )

    renderUsers = users => (
		<div className="row js--wp-2">
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
							<span className="post"> {user.department} </span>
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
	);

	render() {
        const { researches, users } = this.state
        const recentResearches = researches.slice(-2);
		return (
            <>
                <section className="section__researches js--section-researches" id="research-topics">
                    <div className="researchers__header">
                        <h2>Recent Research Topics</h2>
                    </div>
                    { this.renderPosts(recentResearches) }   
                    <div className="discover__more">
                        <Link
                            to="/researches"
                            className="discover__btn btn-gradient">
                                Discover More
                        </Link> 
                    </div>   
                    
                </section>
                <section className="section__members" id="faculty-members">
                    <div className="container">
                        <div className="members__header">
                            <h2>Faculty Members</h2>
                        </div>
                        { this.renderUsers(users) }    
                    </div>
                    <div className="discover__more">
                        <Link
                            to="/faculty-members"
                            className="discover__btn btn-gradient">
                                See More
                        </Link> 
                    </div>                
                </section>
                <section className="section__info js--section-info">
                    <div class="row js--wp-3">
                        <h2>Web-based Thesis Workflow Management System</h2>
                    </div>
                    <div class="info">
                        <blockquote>
                            Web-based Thesis Workflow Management System is an application that constructs bridge between students and faculty members virtually.
                            Thanks to this project, you as a student will search many research topics in a single page. Whenver you find the topic which fits best for you,
                            you will be able to contact with faculty member who publishes the topic that you are interested in. On the other hand, Faculty Members will be 
                            able to find ambitious students who are interested in their research area. If you want to join this community, do not wait any longer. Click 
                            the button below to sign up!
                        </blockquote>
                        <div className="info__btn">
                            <Link 
                                to="/signup"
                                className="btn-purple">
                                    Sign Up
                            </Link>
                        </div>
                    </div>
                </section>
                
            </>
		);
	}
}

export default Home;