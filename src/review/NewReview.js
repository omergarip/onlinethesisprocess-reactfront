import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { getReviewByUser, update } from './apiReview';
import { getAdviserByStudentId } from '../adviser/apiAdviser';
import NewResearch from '../research/NewResearch';
import { Redirect } from 'react-router-dom';
import '../css/main.css';

class NewReview extends Component {
	constructor() {
		super();
		this.state = {
			title: '',
			body: '',
			reference: '',
			references: [],
			reviewId: '',
			error: '',
			adviserId: '',
			loading: false,
			redirectToReview: false
		};
	}

	componentDidMount() {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;

		getAdviserByStudentId(userId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ adviserId: data[0].requestedTo._id });
			}
		});
		getReviewByUser(userId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({
					reviewId: data[0]._id,
					title: data[0].title,
					body: data[0].body,
					references: data[0].references
				});
			}
		});
	}

	isValid = () => {
		const { title, body } = this.state;
		if (title.length === 0 || body.length === 0) {
			this.setState({ error: 'All fields are required', loading: false });
			return false;
		}
		return true;
	};

	handleChange = name => event => {
		this.setState({ error: '' });
		this.setState({
			[name]: event.target.value
		});
	};

	addCitation = event => {
		if (event.key === 'Enter') {
			event.preventDefault();
			event.target.value = '';
			this.setState({
				references: [...this.state.references, this.state.reference],
				reference: ''
			});
		}
	};

	removeCitation = event => {
		event.preventDefault();
		let filteredArray = this.state.references.filter(item => item !== event.target.id);
		this.setState({ references: filteredArray });
	};

	clickSubmit = event => {
		event.preventDefault();
		this.setState({ loading: true });

		if (this.isValid()) {
			const userId = isAuthenticated().user._id;
			const token = isAuthenticated().token;
			const reviewId = this.state.reviewId;
			const { title, body, adviserId, references } = this.state;
			const review = {
				adviserId,
				title,
				body,
				references
			};
			update(userId, token, reviewId, review).then(data => {
				if (data.error) {
					this.setState({ error: data.error });
				} else {
					this.setState({
						loading: false,
						redirectToReview: true
					});
				}
			});
		}
	};

	newResearchForm = (title, body) => (
		<form>
			<div className="form-group">
				<label className="text-muted">Title</label>
				<input
					onChange={this.handleChange('title')}
					type="text"
					className="form-control"
					value={title}
				/>
			</div>
			<div className="form-group">
				<label className="text-muted">Whole Description</label>
				<textarea
					rows="15"
					onChange={this.handleChange('body')}
					type="text"
					className="form-control"
					value={body}
				/>
			</div>
			<ul class="list">
				{this.state.references.map((reference, i) => (
					<li class="task">
						[{i + 1}] {reference}
						<span id={reference} onClick={this.removeCitation}>
							X
						</span>
					</li>
				))}
			</ul>
			<section class="citationForm">
				<input
					onChange={this.handleChange('reference')}
					type="text"
					id="todoInput"
					onKeyPress={this.addCitation}
					placeholder="Please write references here and press enter!"
				/>
			</section>
			<button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
				Save
			</button>
		</form>
	);

	render() {
		const { title, body, redirectToReview, error, loading } = this.state;

		if (redirectToReview) {
			return <Redirect to={`/user/${isAuthenticated().user._id}/thesis-process`} />;
		}

		return (
			<div className="container">
				<h2 className="mt-5 mb-5">Literature Review</h2>
				<div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
					{error}
				</div>

				{loading ? (
					<div className="jumbotron text-center">
						<h2>Loading...</h2>
					</div>
				) : (
					''
				)}

				{this.newResearchForm(title, body)}
			</div>
		);
	}
}

export default NewReview;