import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { getThesisByProcessId, createThesis, updateChapter } from './apiThesis';
import { getProcess } from '../process/apiProcess';
import { Redirect } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import Loading from '../core/Loading';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import parse from 'html-react-parser'

import Diff from 'react-stylable-diff'



class Chapter extends Component {
	constructor() {
		super();
		this.state = {
			title: '',
			body: '',
			oldTitle: '',
			oldBody: '',
			revisedTitle: '',
			revisedBody: '',
			reference: '',
			references: [],
			newReferences: [],
			message: '',
			thesisId: '',
			error: '',
			adviserId: '',
			loading: false,
			redirectToProfile: false
		};
	}

	componentDidMount() {
		const pId = this.props.match.params.pId;
		const token = isAuthenticated().token;
		getThesisByProcessId(pId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({
					adviserId: data[0].adviserId,
					references: data[0].references,
					done: true
				});
				const chapters = data[0].chapters
				chapters.map(chapter => {

					if (chapter._id === this.props.match.params.chapterId) {
						this.setState({
							title: chapter.title,
							body: chapter.body,
							oldTitle: chapter.title,
							oldBody: chapter.body,
							revisedBody: chapter.revisedBody,
							revisedTitle: chapter.revisedTitle,
							message: chapter.message,
						})
					}

				})
			}
		});
		const parsedBody = ReactHtmlParser(this.state.body)
		console.log()
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
				newReferences: [...this.state.newReferences, this.state.reference],
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

	handleMessage = (content, editor) => {
		this.setState({ message: content });
	}

	update = (chapters) => {
		const thesisId = this.props.match.params.thesisId;
		const token = isAuthenticated().token;
		const chapterId = this.props.match.params.chapterId
		const newReferences = this.state.newReferences
		updateChapter(thesisId, token, chapters, chapterId, newReferences).then(data => {
			if (data.error) {
				this.setState({ error: data.error });
			} else {
				this.setState({
					done: true,
					redirectToProfile: true
				})
			}
		});
	}

	acceptChanges = event => {
		event.preventDefault();
		const { body, title, message } = this.state
		let status = 'Approved'
		const chapters = {
			title, body, message, status
		}
		this.update(chapters)
	}

	clickSubmit = event => {
		event.preventDefault();
		const { adviserId, oldBody, oldTitle, message } = this.state
		if (isAuthenticated().user._id === adviserId) {
			let revisedBody = this.state.body;
			let revisedTitle = this.state.title;
			let body = oldBody
			let title = oldTitle
			let status = 'Approved'
			const chapters = {
				title, body, revisedTitle, revisedBody, status, message
			}
			console.log(chapters)
			this.update(chapters)
		} else {
			const { body, title } = this.state
			const chapters = {
				title, body
			}
			this.update(chapters)
		}
	};

	redirectToTarget = (pId, thesisId) => {
		if (isAuthenticated().user._id === this.state.adviserId)
			this.props.history.push(`/user/${isAuthenticated().user._id}/thesis-approval`)
		else
			this.props.history.push(`/thesis-process/${pId}/thesis/${thesisId}/chapters`)
	}

	NewIntroduction = (title, body, revisedTitle, revisedBody, message) => (
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
					value={body}
				/>
				{isAuthenticated().user._id === this.state.adviserId ?
					<Editor
						apiKey='r6k4f5v8jezbsj87dms1ybq9brk2m0a4h65dk7vkei4brc8r'
						init={{
							height: 500,
							plugins: 'a11ychecker advcode casechange formatpainter linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tinycomments tinymcespellchecker',
							toolbar: 'a11ycheck addcomment showcomments casechange checklist code formatpainter pageembed permanentpen table',
							tinycomments_mode: 'embedded',
							tinycomments_author: `${isAuthenticated().user.fname} ${isAuthenticated().user.lname}`,
						}}
						onEditorChange={this.handleMessage}
						value={message}
					/> : null}
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
					{isAuthenticated().user._id === this.state.adviserId ? 'Edit and Approve' : 'Save and Close'}
				</button>
			}

		</form>
	);

	render() {
		const { title, body, revisedTitle, revisedBody, message, redirectToProfile, error, done, stripedBody, stripedRevisedBody } = this.state;
		const pId = this.props.match.params.pId;
		const thesisId = this.props.match.params.thesisId;
		if (redirectToProfile) {
			this.redirectToTarget(pId, thesisId)
		}



		return (
			<> {
				!body ?
					<Loading done={done} />
					:
					<section className="section__create-chapter">
						<div className="container" id="thesis">
							<h2>Create Chapter</h2>
							<div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
								{error}
							</div>
							{this.NewIntroduction(title, body, message)}


						</div>
					</section>
			}



			</>
		);
	}
}

export default Chapter;