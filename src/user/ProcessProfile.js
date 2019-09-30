import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import { create, getReviewByUser } from '../review/apiReview';
import { read, createProcess, deleteProcess } from '../studentProcess/apiStudentProcess';
import '../css/profile.css';
import '../css/process.css';

class ProcessProfile extends Component {
	constructor() {
		super();
		this.state = {
			studentProcess: [],
			redirectToReview: false,
			loading: false,
			newProcess: false,
			topicStatus: false,
			adviserStatus: false,
			formStatus: false,
			introStatus: false,
			literatureStatus: false,
			methodologyStatus: false,
			reviewId: '',
			review: ''
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
				else {
					this.setState({ 
						studentProcess: data,
						topicStatus: data[0].topicStatus,
						adviserStatus: data[0].adviserStatus,
						formStatus: data[0].formStatus,
					});
				}
					
			}
		});
		getReviewByUser(userId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				if (data.length !== 0) {
					this.setState({	
						review: data,
						reviewId: data[0]._id 
					});
					if (data[0].introBody !== "")
						this.setState({ introStatus: true })
				}
					
				
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
						this.setState({ 
							studentProcess: data,
							topicStatus: data[0].topicStatus,
							adviserStatus: data[0].adviserStatus,
							formStatus: data[0].formStatus,
						});
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
		if (this.state.review.length === 0) {
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
		} else {
			this.setState({ redirectToReview: true 	})
		}
		
		// const userId = isAuthenticated().user._id;
		// const pId = this.state.studentProcess[0]._id;
		// const topic = this.state.studentProcess[0].topic._id;
		// const topicStatus = true;
		// const studentInfo = userId;
		// const adviser = this.state.studentProcess[0].adviser._id;	
		// const adviserStatus = true;
		// const formStatus = true;
		// const reviewId = this.state.reviewId;
		// const introStatus = true;
		// const data = {
		// 	studentInfo, topic, topicStatus,
		// 	adviser, adviserStatus, formStatus,
		// 	reviewId, introStatus
		// };
		// deleteProcess(userId, token, pId).then(data => {
		// 	if (data.error) {
		// 		this.setState({ error: data.error });
		// 	}
		// });
		// createProcess(userId, token, data).then(data => {
		// 	if (data.error) {
		// 		this.setState({ error: data.error })
		// 	}
		// })
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
		const { redirectToReview, studentProcess, topicStatus, adviserStatus, formStatus, introStatus, newProcess } = this.state;

		if (redirectToReview)
			return <Redirect to={`/user/${isAuthenticated().user._id}/new-review`} />;

		return (
			<div className="container">
				{	newProcess ? (
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
					) : 

					!newProcess ? (
					<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
						<div class="panel panel-default">
							
							
							<div class="panel-heading" role="tab" id="headingOne">
								<h4 class="panel-title">
									<a className={ topicStatus ? "collapsed status" : "collapsed"} role="button" data-toggle="collapse" 
										data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
										Select Research Topic { topicStatus ? <span class="checkmark">&#10003;</span> : ''}
									</a>
								</h4>
							</div>
							<div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
								<div class="panel-body">
									{
										!topicStatus ? (
											<div>
												<p className="lead process-text text-center">
													The first thing is to select research topic. 
												</p> 
												<p className="lead process-text text-center">
													Click button to find research topics.
												</p> 
												<div className="d-flex justify-content-center">
													<Link
														to={`/researches`}	>
															Find Research Topic
													</Link>
												</div>
											</div> )
											: (
											<div>
												<p className="lead process-text text-center">
													You have selected the researc topic.
												</p>
												<div className="d-flex justify-content-center">
													<Link
														to={`/research/${studentProcess[0].topic._id}`}	>
															{ studentProcess[0].topic.title }
													</Link>
												</div>
											</div>
											)			
									}
								</div>
							</div>
				{   topicStatus ? (	
						<div>	
							<div class="panel-heading mt-4" role="tab" id="headingOne">
								<h4 class="panel-title">
									<a className={adviserStatus ? "collapsed status" : "collapsed"} role="button" data-toggle="collapse" 
									data-parent="#accordion" href="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
										Select Adviser { adviserStatus ? <span class="checkmark">&#10003;</span> : ''}
									</a>
								</h4>
							</div>
							<div id="collapseTwo" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
								<div class="panel-body">
									{
										!adviserStatus ? 
										<div>
											<p className="lead process-text text-center">
												Now, You can select your adviser.
											</p>
											<p className="lead process-text text-center">
												Click button to find your adviser.
											</p>
											<div className="d-flex justify-content-center">
												<Link
													to={`/faculty-members`}
													className="btn btn-info">
														Select Adviser.
												</Link>
											</div>
										</div> : 
										<div>
											<p className="lead process-text text-center">
												You have selected your adviser.
											</p>
											<div className="d-flex justify-content-center">
												<Link
													to={`/user/${studentProcess[0].adviser._id}`}
												>
														{studentProcess[0].adviser.fname} {studentProcess[0].adviser.lname}
												</Link>
											</div>
										</div>
									} 		
								</div>
							</div>
						</div>
					): ''
				}
				{   topicStatus && adviserStatus ? (	
					<div>	
						<div class="panel-heading mt-4" role="tab" id="headingOne">
							<h4 class="panel-title">
								<a className={formStatus ? "collapsed status" : "collapsed"} role="button" data-toggle="collapse" 
								data-parent="#accordion" href="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
									Supervisor Appointment Form { formStatus ? <span class="checkmark">&#10003;</span> : ''}
								</a>
							</h4>
						</div>
						<div id="collapseThree" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
							<div class="panel-body">
								{
									!formStatus ? 
									<div>
										<p className="lead process-text text-center">
											Now, You need to fill out 'Supervisor Appointment Form'.
										</p>
										<p className="lead process-text text-center">
											Click button to fill out the form.
										</p>
										<div className="d-flex justify-content-center">
											<Link
												to={`/user/${isAuthenticated().user._id}/thesis-form`}
												className="btn btn-info">
													Go to the form.
											</Link>
										</div>
									</div> : 
									<div>
										<p className="lead process-text text-center">
											You have filled out 'Supervisor Appointment Form' .
										</p>
										<div className="d-flex justify-content-center">
											<Link
												to={`/user/${isAuthenticated().user._id}/thesis-form`}
											>
												View Form
											</Link>
										</div>
									</div>
								} 		
							</div>
						</div>
					</div>
					): ''	
				}
				
				{   topicStatus && adviserStatus && formStatus ? (	
					<div>	
						<div class="panel-heading mt-4" role="tab" id="headingOne">
							<h4 class="panel-title">
								<a className={introStatus ? "collapsed status" : "collapsed"} role="button" data-toggle="collapse" 
								data-parent="#accordion" href="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
									Introduction { introStatus ? <span class="checkmark">&#10003;</span> : ''}
								</a>
							</h4>
						</div>
						<div id="collapseFour" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
							<div class="panel-body">
								{
									!introStatus ? 
									<div>
										<p className="lead process-text text-center">
											Now, You need to write the Introduction of the Problem.
										</p>
										<p className="lead process-text text-center">
											Click button to write Introduction.
										</p>
										<div className="d-flex justify-content-center">
											<button
												onClick={this.newReview}
												className="btn btn-info">
													Introduction
											</button>
										</div>
									</div> : 
									<div>
										<p className="lead process-text text-center">
											
										</p>
										<div className="d-flex justify-content-center">
											<Link
												to={`/user/${isAuthenticated().user._id}/new-review`}
											>
												Edit Introduction
											</Link>
										</div>
									</div>
								} 		
							</div>
						</div>
					</div>	
					
					): ''
				}
				
					</div>
				</div>	
				) : ''
				}	
			</div>
			
		);
	}
}

export default ProcessProfile;