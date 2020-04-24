import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { getThesisByProcessId, createThesis, createChapter } from './apiThesis';
import { getProcess } from '../process/apiProcess';
import { Redirect } from 'react-router-dom';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Editor } from '@tinymce/tinymce-react';
import Loading from '../core/Loading';

class NewChapter extends Component {
	constructor() {
		super();
		this.state = {
			title: '',
			body: '',
			reference: '',
			references: [],
			thesisId: '',
			error: '',
			adviserId: '',
			loading: false,
			redirectToProfile: false
		};
	}

	componentDidMount() {

	}

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

	handleEditorChange = (content, editor) => {
		this.setState({ body: content });

	}

	clickSubmit = event => {
		event.preventDefault();
		const processId = this.props.match.params.pId;
		const token = isAuthenticated().token;
		const { title, body, references } = this.state
		const chapters = {
			title, body
		}

		getThesisByProcessId(processId, token).then(data => {
			if (data.error) {
				this.setState({ error: data.error });
			} else {
				const thesisId = data[0]._id
				this.setState({ thesisId: data[0] })
				createChapter(thesisId, token, chapters, references).then(data => {
					this.setState({
						loading: false,
						redirectToProfile: true
					});

				});
			}
		});
	};

	redirectToTarget = (pId, thesisId) => {
		this.props.history.push(`/thesis-process/${pId}/thesis/${thesisId}/chapters`)
	}

	NewIntroduction = (title, body) => (
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
				<label className="text-muted">Body</label>
				{/* <CKEditor
					editor={ClassicEditor}
					data={body || ''}
					onChange={this.handleEditorChange()}
				/> */}
				<Editor
					apiKey='r6k4f5v8jezbsj87dms1ybq9brk2m0a4h65dk7vkei4brc8r'
					init={{
						height: 500,
						plugins: 'a11ychecker advcode casechange formatpainter linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tinycomments tinymcespellchecker',
						toolbar: 'a11ycheck addcomment showcomments casechange checklist code formatpainter pageembed permanentpen table',
						tinycomments_mode: 'embedded',
						tinycomments_author: `${isAuthenticated().user.fname} ${isAuthenticated().user.lname}`,
					}}
					onEditorChange={this.handleEditorChange}
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
		const { title, body, redirectToProfile, error, loading } = this.state;
		const pId = this.props.match.params.pId;
		const thesisId = this.props.match.params.thesisId;
		if (redirectToProfile) {
			this.redirectToTarget(pId, thesisId)
		}

		return (
			<div className="container" id="thesis">
				<h2 className="mt-5 mb-5">Create Chapter</h2>
				<div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
					{error}
				</div>

				{loading ? (
					<Loading />
				) : (
						''
					)}

				{this.NewIntroduction(title, body)}
			</div>

		);
	}
}

export default NewChapter;