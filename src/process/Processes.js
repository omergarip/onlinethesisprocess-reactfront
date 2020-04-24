import React, { Component } from 'react';
import SelectTopic from './SelectTopic';
import SelectAdviser from './SelectAdviser';
import ThesisForm from './ThesisForm';
import Thesis from './Thesis';
import FormCommittee from './FormCommittee';
import workflow from '../images/workflow.jpg';
import { Accordion, AccordionItem } from 'react-light-accordion';
import UploadFile from './UploadFile';


class Processes extends Component {
	constructor() {
		super();
		this.state = {
			process: [],
			redirectToReview: false,
			loading: false,
			active: false
		};
	}
	handleClick = e => {
		this.setState({ active: true })
	}

	render() {
		const { activeIndex } = this.state
		return (
			<div className="process__page">
				<div className="row mt-5">
					<div className="col-md-4 workflow">
						<img src={workflow} />
						<a className="btn-purple" href="/static/media/workflow.3cce826e.jpg" target="_blank">View workflow</a>
					</div>
					<div className="col-md-8 mt-5">
						<Accordion atomic={true}>

							<SelectTopic pId={this.props.match.params.pId} />
							<SelectAdviser pId={this.props.match.params.pId} />
							<ThesisForm pId={this.props.match.params.pId} />
							<Thesis pId={this.props.match.params.pId} />
							<FormCommittee pId={this.props.match.params.pId} />
							<UploadFile pId={this.props.match.params.pId} />
						</Accordion>
					</div>
				</div>
			</div>


		);
	}
}

export default Processes;