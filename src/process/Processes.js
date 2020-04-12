import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getProcessByUserId } from './apiProcess';
import { isAuthenticated } from '../auth';
import SelectTopic from './SelectTopic';
import SelectAdviser from './SelectAdviser';
import ThesisForm from './ThesisForm';
import Introduction from './Introduction';
import LiteratureReview from './LiteratureReview';
import Methodology from './Methodology';
import FormCommittee from './FormCommittee';
import workflow from '../images/workflow.jpg';


class Processes extends Component {
	constructor() {
		super();
		this.state = {
			process: [],
			redirectToReview: false,
			loading: false,
		};
	}

	componentDidMount() {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		getProcessByUserId(userId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({
					process: data[0],
					loading: false
				});
			}
		});
	}

	render() {
		const { process } = this.state
		return (
			<div className="">
				<Link className="btn btn-primary">Thesis</Link>
				<div className="row">
					<div className="col-md-4 workflow">
						<img src={workflow} />
						<a className="btn-purple" href="/static/media/workflow.3cce826e.jpg" target="_blank">View workflow</a>
					</div>
					<div className="col-md-8">

						<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
							<div class="panel panel-default">
								<SelectTopic pId={this.props.match.params.pId} />
								<SelectAdviser pId={this.props.match.params.pId} />
								<ThesisForm pId={this.props.match.params.pId} />
								<Introduction pId={this.props.match.params.pId} />
								<LiteratureReview pId={this.props.match.params.pId} />
								<Methodology pId={this.props.match.params.pId} />
								<FormCommittee pId={this.props.match.params.pId} />
							</div>
						</div>
					</div>
				</div>
			</div>

		);
	}
}

export default Processes;