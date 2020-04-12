import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { getMethodologyByProcessId, createMethodology } from './apiThesis';
import { updateMethodology, getProcess } from '../process/apiProcess';
import { Redirect } from 'react-router-dom';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class NewMethodology extends Component {
	constructor() {
		super();
		this.state = {
			methodologyTitle: 'Methodology',
			methodologyBody: '',
			reference: '',
			references: [],
			methodologyId: '',
			adviserId: '',
			error: '',
			adviserId: '',
			loading: false,
			redirectToProfile: false
		};
	}

	componentDidMount() {
		const pId = this.props.match.params.pId;
		const token = isAuthenticated().token;
		getProcess(pId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({
					process: data[0],
					adviserId: data[0].adviserId._id,
					loading: false
				});
			}
		});
	}

	handleChange = name => event => {
		this.setState({ error: '' });
		this.setState({
			[name]: event.target.value
		});
	};

	handleEditorChange() {
		return (event, editor) => {
			this.setState({ methodologyBody: editor.getData() });
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
		const processId = this.props.match.params.pId;
		const adviserId = this.state.adviserId;
		const token = isAuthenticated().token;
		const { methodologyTitle, methodologyBody, references } = this.state
		const methodology = {
			processId, adviserId, methodologyTitle, methodologyBody, references
		}
		createMethodology(processId, token, methodology).then(data => {
			if (data.error) {
				this.setState({ error: data.error });
			} else {
				getMethodologyByProcessId(processId, token).then(data => {
					if (data.error) {
						this.setState({ error: data.error });
					} else {
						const metId = data[0]._id
						this.setState({ introId: data[0] })
						updateMethodology(processId, metId, token).then(data => {
							if (data.error) {
								this.setState({ error: data.error });
							} else {
								this.setState({
									loading: false,
									redirectToProfile: true
								});
							}
						});
					}
				});
			}
		});
	};

	redirectToTarget = (pId) => {
		this.props.history.push(`/thesis-process/${pId}`)
	}

	NewMethodology = (methodologyTitle, methodologyBody) => (
		<form>
			<div className="form-group">
				<label className="text-muted">Title</label>
				<input
					onChange={this.handleChange('methodologyTitle')}
					type="text"
					className="form-control"
					value={methodologyTitle}
				/>
			</div>
			<div className="form-group">
				<label className="text-muted">Body</label>
				<CKEditor
					editor={ClassicEditor}
					data={methodologyBody || ''}
					onChange={this.handleEditorChange()}
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
			<div class="citationForm">
				<input
					onChange={this.handleChange('reference')}
					type="text"
					id="todoInput"
					onKeyPress={this.addCitation}
					placeholder="Please write references here and press enter!"
				/>
			</div>
			{

				<button
					onClick={this.clickSubmit}
					className="btn-purple"
					id="process__btn" >
					Save and Close
				</button>
			}

		</form>
	);

	render() {
		const { methodologyTitle, methodologyBody, redirectToProfile, error, loading } = this.state;
		const pId = this.props.match.params.pId;
		if (redirectToProfile) {
			this.redirectToTarget(pId)
		}

		return (
			<div className="container" id="thesis">
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

				{this.NewMethodology(methodologyTitle, methodologyBody)}
			</div>

		);
	}
}

export default NewMethodology;