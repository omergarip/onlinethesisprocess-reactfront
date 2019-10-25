import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { getProcess } from './apiProcess';
import { updateIntroStatus } from '../thesis/apiThesis';

class Introduction extends Component {
	constructor() {
		super();
		this.state = {
            process: [],
            pId: '',
            introId: '',
            loading: false,
            status: '',
            redirectToProfile: false
		};
	}

	componentDidMount() {
		const pId = this.props.pId;
		const token = isAuthenticated().token;
		getProcess(pId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
                this.setState({ 
                    process : data[0],
                    pId : data[0]._id,
                    introId: data[0].introductionId._id,
                    status: data[0].introductionId.status,
                    loading: false
                });	
			}
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state != nextState;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.status === prevState.status) {
            const pId = this.props.pId;
            const token = isAuthenticated().token;
            getProcess(pId, token).then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    this.setState({ 
                        process : data[0],
                        pId : data[0]._id,
                        introId: data[0].introductionId._id,
                        status: data[0].introductionId.status,
                        loading: false
                    });	
                }
            });
        }
    }
    
    clickSubmit = event => {
        event.preventDefault();
        const introId = this.state.introId;
        const token = isAuthenticated().token;
        const status = 'Sent'
        const introduction = { status }
        updateIntroStatus(introId, token, introduction).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    loading: false,
                    redirectToProfile:  true
                });
            }
        });
    };

	render() {
        const { process, pId, introId, status} = this.state;
        
		return (
            <>
            
                {   process.topicId && process.adviserId && process.formId ? (	
                    <div>	
                        <div class="panel-heading mt-4" role="tab" id="headingOne">
                            <h4 class="panel-title">
                                <a className={status === 'Approved' ? "collapsed status" : "collapsed"} role="button" data-toggle="collapse" 
                                data-parent="#accordion" href="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
                                    Introduction { status === 'Approved' ? <span class="checkmark">&#10003;</span> : ''}
                                </a>
                            </h4>
                        </div>
                        <div id="collapseFour" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                            <div class="panel-body">
                                {
                                    process.introductionId === undefined ? 
                                    <div>
                                        <p className="lead process-text text-center">
                                            Now, It's time to write Introduction for your thesis.
                                        </p>
                                        <p className="lead process-text text-center">
                                            Click button to write Introduction.
                                        </p>
                                        <div className="d-flex justify-content-center">
                                            <Link
                                                to={`/thesis-process/${pId}/introduction`}
                                                className="btn-purple" id="process__btn">
                                                    Write Introduction
                                            </Link>
                                        </div>
                                    </div> : 
                                    <div>
                                        {   
                                            
                                            status === 'Approved' ? (
                                                <>
                                                <p className="lead process-text text-center">
                                                    Your introduction is approved. However, You can still edit it.
                                                </p>
                                                <div className="d-flex justify-content-center">
                                                    <Link
                                                        id="process__link"
                                                        className="btn btn-warning"
                                                        to={`/thesis-process/${pId}/introduction/${introId}`}
                                                    >
                                                        Edit Introduction
                                                    </Link>
                                                </div>
                                                </>
                                            ) : (
                                                <>
                                                <p className="lead process-text text-center">
                                                    Here, You can either continue to write your introduction or send it to adviser for approval.
                                                </p>
                                                <div className="d-flex justify-content-center">
                                                    {
                                                        status === 'Not Sent' ? (
                                                        <button
                                                            id="process__link"
                                                            onClick={this.clickSubmit}
                                                            className="btn btn-info mr-4"
                                                        >
                                                            Send it for Revision
                                                        </button>
                                                        ) : ''
                                                    }
                                                    {
                                                        status === 'Sent' ? (
                                                        <button
                                                            id="process__link"
                                                            onClick={this.clickSubmit}
                                                            className="btn btn-info mr-4"
                                                            disabled
                                                        >
                                                            Waiting for approval
                                                        </button>
                                                        ) : ''
                                                    }
                                                    <Link
                                                        id="process__link"
                                                        className="btn btn-warning"
                                                        to={`/thesis-process/${pId}/introduction/${introId}`}
                                                    >
                                                        Edit Introduction
                                                    </Link>
                                                </div>
                                                </>
                                                )
                                                
                                            
                                        }
                                        
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

export default Introduction;