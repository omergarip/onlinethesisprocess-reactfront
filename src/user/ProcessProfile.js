import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import { getAdvisers, accept, remove } from '../adviser/apiAdviser';
import { create } from '../review/apiReview';
import { createProcess, read } from '../studentProcess/apiStudentProcess';
import '../css/profile.css';

class ProcessProfile extends Component {
	constructor() {
		super();
		this.state = {
			studentProcess: [],
			redirectToReview: false,
			loading: false,
			newProcess: false
		};
	}

	componentDidMount() {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		read(userId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				if (data.length === 0)
					this.setState({ newProcess: true });
				else
					this.setState({ studentProcess: data });
			}
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state !== nextState;
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		if (this.state.studentProcess === prevState.studentProcess  && this.state.newProcess === prevState.newProcess) {
				read(userId, token).then(data => {
				if (data.error) {
					console.log(data.error);
				} else {
					if (data.length === 0)
						this.setState({ newProcess: true });
					else
						this.setState({ studentProcess: data });
				}
			});
		}
		
	}

	newReview = event => {
		event.preventDefault();
		this.setState({
			loading: true
		});

		const studentId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		const review = { studentId };
		create(studentId, token, review).then(data => {
			if (data.error) {
				this.setState({ error: data.error });
			} else {
				this.setState({
					loading: false,
					redirectToReview: true
				});
			}
		});
	};

	newStudentProcess = event => {
		event.preventDefault();
		this.setState({
			loading: true
		});
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		const studentInfo = isAuthenticated().user._id;
		const data = { studentInfo };
		createProcess(userId, token, data).then(data => {
			if (data.error) console.log(data.error);
			else
				this.setState({
					loading: false,
					newProcess: false
				});
		});
	};

	render() {
		const { redirectToReview, requests, studentProcess, newProcess } = this.state;

		if (redirectToReview)
			return <Redirect to={`/user/${isAuthenticated().user._id}/new-review`} />;

		return (
			<div className="container">
				{newProcess ? (
					<div className="container jumbotron">
						<h1 className="display-6 text-center">
							YSU Online Thesis Process Management System
						</h1>
						<p className="lead">
							This is the page that you can keep track of your thesis process. If you
							are ready to start journey, please click button below!
						</p>
						<div className="d-flex justify-content-center">
							<button 
								className="btn btn-info mt-4"
								onClick={ this.newStudentProcess }>
									Start your process.
							</button>
						</div>
					</div>
				) : (		
						studentProcess.map(
						(process, i) =>
							process.topicStatus === false ? (
								<div className="container jumbotron">
									<h1 className="display-6 text-center">
										Select Research Topic
									</h1>
									<p className="lead text-center">
										The first thing is to select research topic. 
									</p>
									<p className="lead text-center">
										Click button to find research topics.
									</p>
									<div className="d-flex justify-content-center">
										<Link
											to={`/researches`}
											className="my-5 btn btn-info">
												Select Research Topic.
										</Link>
									</div>
								</div>
							) : process.topicStatus === true && process.reviewStatus === false ? (
								<div className="container jumbotron">
									<h1 className="display-6 text-center">
										Select Research Topic
									</h1>
									<p className="lead text-center">
										The first thing is to select research topic. 
									</p>
									<p className="lead text-center">
										Click button to find research topics.
									</p>
									<div className="d-flex justify-content-center">
										<Link
											to={`/user/${isAuthenticated().user._id}/thesis-form`}
											className="my-5 btn btn-info mx-auto form-control disabled">
												You have selected the research topic.
										</Link>
										<Link
											to={`/user/${isAuthenticated().user._id}/thesis-form`}>
												You have selected the research topic.
										</Link>
										<button onClick={this.newReview} className="my-5 btn btn-info mx-auto form-control">
											Create Literature Review
										</button> 
									</div>
								</div>
								
							) : ''
				
						)
				)}

				
			</div>
		);
	}
}

export default ProcessProfile;