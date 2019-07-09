import React, { Component } from 'react';
import { getResearch } from './apiResearch';
import { read, createProcess, deleteProcess } from '../studentProcess/apiStudentProcess';
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
			studentProcess: []
		};
	}

	componentDidMount() {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		const researchId = this.props.match.params.rId;
		read(userId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ studentProcess: data });
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
		return this.state != nextState;
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		if (this.state.studentProcess === prevState.studentProcess) {
			read(userId, token).then(data => {
				if (data.error) {
					console.log(data.error);
				} else {
					this.setState({ studentProcess: data });
				}
			});
		}
	}

	clickSubmit = event => {
		event.preventDefault();
		this.setState({ loading: true });
		const userId = isAuthenticated().user._id;
		const pId = this.state.studentProcess[0]._id;
		const token = isAuthenticated().token;
		const topic = this.state.research._id;
		const topicStatus = true;
		const studentInfo = userId;
		const data = {
			studentInfo, topic, topicStatus
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

	renderPosts = (research, createdBy, studentProcess) => (
		<div className="row">
			<div className="card mt-5">
				<h5 class="card-header">{research.title}</h5>
				<div class="card-body">
					<p class="card-text">{research.body}</p>
					<p class="float-right">
						<strong>
							Submitted By: {createdBy.fname} {createdBy.lname}
						</strong>
						<br />
						<strong>Department: {createdBy.department} </strong>
						<br />
						<strong>Email: {createdBy.email} </strong>
					</p>
					<br />
					<br />
					<br />

					{studentProcess.length === 0 ? (
						<button onClick={this.clickSubmit} className="btn btn-info">
							Select This Topic
						</button>
					) : (
						studentProcess.map(
							(data, i) =>
								data.studentInfo._id === isAuthenticated().user._id && !data.topicStatus ? (
									<button onClick={this.clickSubmit} className="btn btn-info">
										Select This Topic
									</button>
								) : (
									<div>
										<p className="text-primary">
											You have selected this topic for your thesis. Now, you
											can select your adviser.
										</p>
										<Link className="btn btn-primary" to={`/user/${isAuthenticated().user._id}/thesis-process`}>
											Go Back to Your Profile
										</Link>
									</div>
								)
						)
					)}
				</div>

				<div class="card-footer text-muted text-center">
					<p class="card-text">{new Date(research.created).toDateString()}</p>
				</div>
			</div>
		</div>
	);
	render() {
		const { research, createdBy, studentProcess } = this.state;

		return (
			<div className="container">{this.renderPosts(research, createdBy, studentProcess)}</div>
		);
	}
}

export default ShowResearch;