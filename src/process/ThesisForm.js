import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { getProcessByUserId } from './apiProcess';

class ThesisForm extends Component {
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
                {   process.topicId !== undefined && process.adviserId ? (	
                    <div>	
                        <div class="panel-heading mt-4" role="tab" id="headingOne">
                            <h4 class="panel-title">
                                <a className={process.formId !== undefined ? "collapsed status" : "collapsed"} role="button" data-toggle="collapse" 
                                data-parent="#accordion" href="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                                    Supervisor Appointment Form { process.formId !== undefined ? <span class="checkmark">&#10003;</span> : ''}
                                </a>
                            </h4>
                        </div>
                        <div id="collapseThree" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                            <div class="panel-body">
                                {
                                    process.formId === undefined ? 
                                    <div>
                                        <p className="lead process-text text-center">
                                            Now, You need to fill out 'Supervisor Appointment Form'.
                                        </p>
                                        <p className="lead process-text text-center">
                                            Click button to fill out the form.
                                        </p>
                                        <div className="d-flex justify-content-center">
                                            <Link
                                                to={`/thesis-process/${process._id}/form`}
                                                className="btn-purple" id="process__btn">
                                                    Fill out the form.
                                            </Link>
                                        </div>
                                    </div> : 
                                    <div>
                                        <p className="lead process-text text-center">
                                            You have filled out 'Supervisor Appointment Form' .
                                        </p>
                                        <div className="d-flex justify-content-center">
                                            <Link
                                                id="process__link"
                                                to={`/thesis-process/${process._id}/form/${process.formId}`}
                                            >
                                                View Form
                                            </Link>
                                        </div>
                                    </div>
                                } 		
                            </div>
                        </div>
                    </div>
                    ): ''	
                }
			</>
		);
    }
};

export default ThesisForm;