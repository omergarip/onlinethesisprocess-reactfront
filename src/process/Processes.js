import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SelectTopic from './SelectTopic';
import SelectAdviser from './SelectAdviser';
import ThesisForm from './ThesisForm';
import Introduction from './Introduction';
import LiteratureReview from './LiteratureReview';
import Methodology from './Methodology';
import workflow from '../images/workflow.jpg';
import '../css/profile.css';
import '../css/process.css';

class Processes extends Component {
	constructor() {
		super();
		this.state = {
			process: [],
			redirectToReview: false,
			loading: false,
		};
	}

	render() {

		return (
			<div className="">
				<Link className="btn btn-primary">Thesis</Link>
				<div className="row">
					<div className="col-md-4 workflow">
						<img src={ workflow }  />
					</div>
					<div className="col-md-8">
						
						<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
							<div class="panel panel-default">
								<SelectTopic pId = { this.props.match.params.pId }/>
								<SelectAdviser pId = { this.props.match.params.pId }/>
								<ThesisForm pId = { this.props.match.params.pId }/>
								<Introduction pId = { this.props.match.params.pId }/>
								<LiteratureReview pId = { this.props.match.params.pId }/>
								<Methodology pId = { this.props.match.params.pId }/>
							</div>
						</div>	
					</div>
				</div>	
			</div>
			
		);
	}
}

export default Processes;