import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { getProcessByUserId } from './apiProcess';

class SelectTopic extends Component {
	constructor() {
		super();
		this.state = {
			process: [],
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
                    process : data[0],
                    loading: false
                });	
			}
		});
	}

	render() {
		const { process } = this.state;

		return (
            <>
                <div class="panel-heading" role="tab" id="headingOne">
                    <h4 class="panel-title">
                        <a className={ process.topicId !== undefined ? "collapsed status" : "collapsed"} role="button" data-toggle="collapse" 
                            data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Select Research Topic { process.topicId !== undefined ? <span class="checkmark">&#10003;</span> : ''}
                        </a>
                    </h4>
                </div>
                <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                    <div class="panel-body">
                    { process.topicId === undefined ? 
                        <>
                        <p className="lead process-text text-center">
                            The first thing is to select research topic. 
                        </p> 
                        <p className="lead process-text text-center">
                            Click button to find research topics.
                        </p> 
                        <div className="process__btn-center">
                            <Link
                                to={`/researches`} className="btn-purple" id="process__btn"	>
                                    Find Research Topic
                            </Link> 
                        </div>	
                        </>
                        : 
                        <div>
                            <p className="lead process-text text-center">
                                You have selected the research topic.
                            </p>
                            <div className="d-flex justify-content-center">
                                <Link
                                    id="process__link"
                                    to={`/research/${process.topicId._id}`}	>
                                        { process.topicId.title }
                                </Link>
                            </div>
                        </div>
                                            
                    }
                    </div>
                </div>
			</>
		);
    }
};

export default SelectTopic;