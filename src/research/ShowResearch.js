import React, { Component } from 'react';
import { getResearch } from './apiResearch';
import { getProcessByUserId, updateProcess, createProcess } from '../process/apiProcess';
import { getPermissions, remove } from '../permission/apiPermission'
import { isAuthenticated } from '../auth';
import { Link, Redirect } from 'react-router-dom';
import Loading from '../core/Loading';

class ShowResearch extends Component {
	constructor() {
		super();
		this.state = {
			done: undefined,
			research: '',
			createdBy: '',
			processData: [],
			studentId: '',
			newProcess: true,
			permissions: [],
			haveAccess: 0
		};
	}

	componentDidMount() {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		const researchId = this.props.match.params.rId;
		getPermissions(userId, token).then(data => {
			if (data.error)
				console.log(data.error)
			else {
				this.setState({
					permissions: data,
					haveAccess: data.length
				})
			}
		})
		getProcessByUserId(userId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				if (data.length === 0)
					console.log(data.error)
				else {
					this.setState({
						processData: data[0],
						studentId: data[0].studentId._id,
						newProcess: false,
						done: true
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
		if (this.state.done !== prevState.done) {
			getProcessByUserId(userId, token).then(data => {
				if (data.error) {
					console.log(data.error);
				} else {
					if (data.length === 0)
						console.log(data.error)
					else {
						this.setState({
							processData: data[0],
							studentId: data[0].studentId._id,
							newProcess: false,
							done: true
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
		if (pId !== undefined) {
			const token = isAuthenticated().token;
			updateProcess(pId, rId, token)
				.then(data => {
					if (data.error)
						console.log(data.error);
					else
						this.setState({ newProcess: false });
				});
		} else {
			const studentId = isAuthenticated().user._id;
			const token = isAuthenticated().token;
			const topicId = this.props.match.params.rId;
			const process = { studentId, topicId }
			createProcess(studentId, token, process).then(data => {
				if (data.error) console.log(data.error);
				else
					this.setState({
						done: true,
						newProcess: false
					});
			});
		}
	};

	dontSelect = event => {
		event.preventDefault();
		this.setState({ done: undefined });
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		getPermissions(userId, token).then(data => {
			if (data.error)
				console.log(data.error)
			else {
				remove(data[0]._id, token)
				this.setState({
					done: true,
					haveAccess: undefined
				})
			}
		})

	}

	renderPosts = (research, createdBy) => (
		<div className="row">
			<div className="card">
				<h5 class="card-header">{research.title}</h5>
				<div class="card-body">
					<p class="card-text">{research.body}</p>
					<hr id="seperator" />
					<div className="researcher__info form-group">
						<p className="">
							<strong>Submitted By: </strong>
							<a className="researcher__info-btn" href={`/user/${createdBy._id}`}>
								<img src={`${process.env.REACT_APP_API_URL}/user/photo/${createdBy._id}?${new Date().getTime()}`}
									alt={`${createdBy.fname} ${createdBy.lname}`}
									className="home-profile"
								/>
								{`${createdBy.fname} ${createdBy.lname}`}
							</a>
						</p>
						<p className="home__dep">
							<strong>Department:</strong> {createdBy.department}
						</p>
						<p className="home__dep">
							<strong>Email: </strong> <a href={`mailto:${createdBy.email}`}>{createdBy.email} </a>
						</p>
					</div>
					<br />
					<br />
					<br />

					{this.state.studentId === "" ?
						<>
							<button onClick={this.clickSubmit} className="btn btn-info mt-1">
								Select This Topic
							</button>
							<button onClick={this.dontSelect} className="btn btn-danger mt-1">
								Do Not Select This Topic
							</button>
						</>
						:
						isAuthenticated().user.userType === 'student' &&
							this.state.studentId === isAuthenticated().user._id &&
							this.state.processData.topicId === undefined ? (
								<>
									<div className="form-group">
										<button onClick={this.clickSubmit} className="btn btn-info form-control">
											Select This Topic
										</button>
										<button onClick={this.dontSelect} className="btn btn-danger form-control">
											Do Not Select This Topic
										</button>
									</div>

								</>
							) : (
								<div>
									<p className="text-primary">
										You have selected this topic for your thesis. Now, you
										can select your adviser.
								</p>
									<Link className="btn btn-primary" to={`/thesis-process/${this.state.processData._id}`}>
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
		const { research, createdBy, done, haveAccess } = this.state;

		if (haveAccess === undefined)
			return <Redirect to={'/researches'} />
		return (
			<>
				{!research ? (
					<Loading done={done} />
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