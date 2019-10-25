import React, { Component } from 'react';
import { getResearch } from './apiResearch';
import { getProcessByUserId, updateProcess } from '../process/apiProcess';
import { isAuthenticated } from '../auth';
import '../css/main.css';
import { Link } from 'react-router-dom';

class ShowResearch extends Component {
	constructor() {
		super();
		this.state = {
			loading: false,
			research: '',
			createdBy: '',
			processData: [],
			studentId: ''
		};
	}

	componentDidMount() {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		const researchId = this.props.match.params.rId;
		getProcessByUserId(userId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				if (data.length === 0)
					console.log(data.error)
				else {
					this.setState({ 
						processData : data[0],
						studentId: data[0].studentId._id,
						newProcess : false,
						loading: false
					});
				}	
			}
		});
		getResearch(researchId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ research: data, createdBy: data.createdBy });
			}
		});
		
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state !== nextState;
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		if (this.state.studentProcess !== prevState.studentProcess) {
			getProcessByUserId(userId, token).then(data => {
				if (data.error) {
					console.log(data.error);
				} else {
					if (data.length === 0)
						console.log(data.error)
					else {
						this.setState({ 
							processData : data[0],
							studentId: data[0].studentId._id,
							newProcess : false,
							loading: false
						});
					}	
				}
			});
		}
	}

	clickSubmit = event => {
		event.preventDefault();
		this.setState({ loading: true });
		const pId = this.state.processData._id;
		const rId = this.props.match.params.rId;
		const token = isAuthenticated().token;
		updateProcess(pId, rId, token)
			.then(data => {
				if (data.error) 
					console.log(data.error);
				else
					this.setState({	newProcess: false });
		});

	};

	renderPosts = (research, createdBy) => (
		<div className="row">
			<div className="card mt-5">
				<h5 class="card-header">{research.title}</h5>
				<div class="card-body">
					<p class="card-text">{research.body}</p>
					<hr id="seperator" />
					<div className="researcher__info form-group">
						<p className="">
							<strong>Submitted By: </strong> 
							<a className="researcher__info-btn" href={`/user/${createdBy._id}`}>
								<img src={ `${process.env.REACT_APP_API_URL}/user/photo/${createdBy._id}?${new Date().getTime()}`  } 
									alt={ `${createdBy.fname} ${createdBy.lname}` } 
									className="home-profile" 
								/>
								{ `${createdBy.fname} ${createdBy.lname}` } 
							</a>
						</p>
						<p className="home__dep">
							<strong>Department:</strong> {createdBy.department } 
						</p>
						<p className="home__dep">
							<strong>Email: </strong> <a href={`mailto:${createdBy.email}`}>{createdBy.email} </a>
						</p>
					</div>	
					<br />
					<br />
					<br />

					{ 
						isAuthenticated().user.userType === 'student' && 
						this.state.studentId === isAuthenticated().user._id && 
						this.state.processData.topicId === undefined ? (
							<button onClick={this.clickSubmit} className="btn btn-info">
								Select This Topic
							</button>
						) : (
							<div>
								<p className="text-primary">
									You have selected this topic for your thesis. Now, you
									can select your adviser.
								</p>
								<Link className="btn btn-primary" to={`/thesis-process/${ this.state.processData._id}`}>
									Go Back to Your Process Page
								</Link>
							</div>
							
					)}
				</div>

				<div class="card-footer text-muted text-center">
					<p class="card-text">{new Date(research.created).toDateString()}</p>
				</div>
			</div>
		</div>
	);
	render() {
		const { research, createdBy, loading } = this.state;

		return (
			<>
			{ loading ? (
				<div className="jumbotron text-center loading__screen">
					<h2>Loading...</h2>
				</div>
			) : 
				<section className="section__researches ">
					<div className="container">
						{this.renderPosts(research, createdBy)}
					</div>
				</section>
			}
			</>
		);
	}
}

export default ShowResearch;