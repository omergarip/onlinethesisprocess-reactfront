import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { getReviewByUser, update } from './apiReview';
import { getAdviserByStudentId } from '../adviser/apiAdviser';
import NewResearch from '../research/NewResearch';
import { Redirect } from 'react-router-dom';
import '../css/main.css';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class NewReview extends Component {
	constructor() {
		super();
		this.state = {
			introTitle: '',
			introBody: '',
			reference: '',
			references: [],
			reviewId: '',
			review: '',
			error: '',
			adviserId: '',
			loading: false,
			redirectToReview: false,
			isDifferent: false,
			focus: false
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
					review: data,
					reviewId: data[0]._id,
					introTitle: data[0].introTitle,
					introBody: data[0].introBody,
					references: data[0].references
				});
				if(data[0].introBody !== "" && data[0].introTitle !== "")
					this.setState({ isDifferent: false });
			}
		});
		ClassicEditor
			.create( document.querySelector( '#introBody' ) )
			.then( editor => {
				window.editor = editor;
			} )
			.catch( err => {
				console.error( err.stack );
			} );
	}

	// isValid = () => {
	// 	const { title, body } = this.state;
	// 	if (title.length === 0 || body.length === 0) {
	// 		this.setState({ error: 'All fields are required', loading: false });
	// 		return false;
	// 	}
	// 	return true;
	// };

	handleChange = name => event => {
		this.setState({ error: '' });
		this.setState({
			[name]: event.target.value
		});			
	};

	_onBlur() {
        setTimeout(() => {
            if (this.state.focus) {
                this.setState({
                    focus: false,
                });
            }
        }, 0);
    }

	_onFocus() {
		if (!this.state.focus) {
            this.setState({
                focus: true,
			});
			const introBody = this.state.introBody;
			const reviewBody = this.state.review[0].introBody;
			console.log(reviewBody === introBody)
			if((reviewBody === undefined && introBody !== "") && reviewBody != introBody) {
				this.setState({ isDifferent: true });
				console.log('1')
			}	
			if(!reviewBody === undefined && reviewBody !== introBody) {
				this.setState({ isDifferent: true });
				console.log('2')
			}
				
			if (!reviewBody === undefined && reviewBody === introBody) {
				this.setState({ isDifferent: false })
				console.log('3')
			}
			if (introBody === "")
				this.setState({ isDifferent: false })
		}
		
    }

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

		// if (this.isValid()) {
			const userId = isAuthenticated().user._id;
			const token = isAuthenticated().token;
			const reviewId = this.state.reviewId;
			const { introTitle, introBody, adviserId, references } = this.state;
			const review = {
				adviserId,
				introTitle,
				introBody,
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
		// }
	};

	newResearchForm = (introTitle, introBody) => (
		<form>
			<div className="form-group">
				<label className="text-muted">Title</label>
				<input
					onChange={this.handleChange('introTitle')}
					type="text"
					className="form-control"
					value={introTitle}
				/>
			</div>
			<div className="form-group">
				<label className="text-muted">Body</label>
				<textarea
					rows="15"
					onChange={this.handleChange('introBody')}
					type="text"
					className="form-control"
					value={introBody}
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
			{
				this.state.isDifferent ? 
					<button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
						Save
					</button>
				: ''
			}
			
		</form>
	);

	render() {
		const { introTitle, introBody, redirectToReview, error, loading } = this.state;

		if (redirectToReview) {
			return <Redirect to={`/user/${isAuthenticated().user._id}/thesis-process`} />;
		}

		return (
			<div className="container">
				<h2 className="mt-5 mb-5">Introduction</h2>
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

				{this.newResearchForm(introTitle, introBody)}
			</div>
			
		);
	}
}

export default NewReview;