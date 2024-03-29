import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { getProcessByUserId, createProcess } from './apiProcess';
import workflow from '../images/workflow.jpg';
import Loading from '../core/Loading';

class newProcess extends Component {
	constructor() {
		super();
		this.state = {
			processId: '',
			loading: false,
			newProcess: true,
		};
	}

	componentDidMount() {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		getProcessByUserId(userId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				if (data.length === 0)
					console.log(data.error)
				else {
					this.setState({
						processId: data[0]._id,
						newProcess: false,
						loading: false
					});
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
		if (this.state.process === prevState.process && this.state.newProcess === prevState.newProcess) {
			getProcessByUserId(userId, token).then(data => {
				if (data.error) {
					console.log(data.error);
				} else {
					if (data.length === 0)
						console.log(data.error)
					else {
						this.setState({
							process: data[0],
							newProcess: false,
							loading: false
						});
					}
				}
			});
		}
	}

	redirectToTarget = (processId) => {
		this.props.history.push(`/thesis-process/${processId}`)
	}

	newProcess = event => {
		event.preventDefault();
		this.setState({
			loading: true
		});
		const studentId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		const process = { studentId }
		createProcess(studentId, token, process).then(data => {
			if (data.error) console.log(data.error);
			else
				this.setState({
					loading: false,
					newProcess: false
				});
		});
	};

	render() {
		const { newProcess, processId, loading } = this.state;

		// if (!newProcess && !loading)
		// 	this.redirectToTarget(processId)

		return (
			<>
				{loading ? (
					<Loading />
				) :

					<section className="section__process">
						<div className="row">
							<div className="col-md-4 workflow">
								<img src={workflow} />
								<a className="btn-purple" href="/static/media/workflow.3cce826e.jpg" target="_blank">View workflow</a>
							</div>
							<div className="col-md-8">
								<div className="container jumbotron">
									<h1 className="display-6 text-center" style={{ fontSize: "2.5rem" }}>
										YSU Web-based Thesis Workflow Management System
									</h1>
									<p className="lead">
										This is the page that you can keep track of your thesis process. If you
										are ready to start your journey, please click button below!
									</p>
									<div className="d-flex justify-content-center">
										<button
											className="btn btn-info mt-4 new-process"
											onClick={this.newProcess}>
											Start your process.
										</button>
									</div>
								</div>
							</div>
						</div>
					</section>

				}


			</>
		);
	}
}

export default newProcess;