import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { getProcessByUserId } from './apiProcess';
import { updateMethodologyStatus } from '../thesis/apiThesis';

class LiteratureReview extends Component {
	constructor() {
		super();
		this.state = {
            process: [],
            pId: '',
            metId: '',
            loading: false,
            reviewStatus: '',
            methodologyStatus: '',
            redirectToProfile: false
		};
	}

	componentDidMount() {
		const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        getProcessByUserId(userId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
                if(data[0].methodologyId === undefined && data[0].reviewId !== undefined)
                    this.setState({ 
                        process : [0],
                        pId : data[0]._id,
                        reviewStatus: data[0].reviewId.status,
                        loading: false
                    });	
                if(data[0].methodologyId !== undefined)
                    this.setState({ 
                        process : data[0],
                        pId : data[0]._id,
                        metId: data[0].methodologyId._id,
                        reviewStatus: data[0].reviewId.status,
                        methodologyStatus: data[0].methodologyId.status,
                        loading: false
                    });	
			}
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state != nextState;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.methodologyStatus === prevState.methodologyStatus) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            getProcessByUserId(userId, token).then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    if(data[0].methodologyId === undefined)
                    this.setState({ 
                        process : data[0],
                        pId : data[0]._id,
                        reviewStatus: data[0].reviewId.status,
                        loading: false
                    });	
                    if(data[0].methodologyId !== undefined)
                    this.setState({ 
                        process : data[0],
                        pId : data[0]._id,
                        metId: data[0].methodologyId._id,
                        reviewStatus: data[0].reviewId.status,
                        methodologyStatus: data[0].methodologyId.status,
                        loading: false
                    });	
                }
            });
        }
    }
    
    clickSubmit = event => {
        event.preventDefault();
        const metId = this.state.metId;
        const token = isAuthenticated().token;
        const status = 'Sent'
        const methodology = { status }
        updateMethodologyStatus(metId, token, methodology).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    loading: false
                });
            }
        });
    };

	render() {
        const { process, pId, metId, methodologyStatus, reviewStatus} = this.state;
        
		return (
            <>
            
                {   reviewStatus === 'Approved' ? (	
                    <div>	
                        <div class="panel-heading mt-4" role="tab" id="headingOne">
                            <h4 class="panel-title">
                                <a className={methodologyStatus === 'Approved' ? "collapsed status" : "collapsed"} role="button" data-toggle="collapse" 
                                data-parent="#accordion" href="#collapseSix" aria-expanded="true" aria-controls="collapseSix">
                                    Methodology { methodologyStatus === 'Approved' ? <span class="checkmark">&#10003;</span> : ''}
                                </a>
                            </h4>
                        </div>
                        <div id="collapseSix" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                            <div class="panel-body">
                                {
                                    process.methodologyId === undefined ? 
                                    <div>
                                        <p className="lead process-text text-center">
                                            Now, Continue with Methodology.
                                        </p>
                                        <p className="lead process-text text-center">
                                            Click button to write Methodology.
                                        </p>
                                        <div className="d-flex justify-content-center">
                                            <Link
                                                to={`/thesis-process/${pId}/methodology`}
                                                className="btn-purple" id="process__btn">
                                                    Write Methodology
                                            </Link>
                                        </div>
                                    </div> : 
                                    <div>
                                        {   
                                            
                                            methodologyStatus === 'Approved' ? (
                                                <>
                                                <p className="lead process-text text-center">
                                                    Your methodology is approved. However, You can still edit it.
                                                </p>
                                                <div className="d-flex justify-content-center">
                                                    <Link
                                                        id="process__link"
                                                        className="btn btn-warning"
                                                        to={`/thesis-process/${pId}/methodology/${metId}`}
                                                    >
                                                        Edit Methodology
                                                    </Link>
                                                </div>
                                                </>
                                            ) : (
                                                <>
                                                <p className="lead process-text text-center">
                                                    Here, You can either continue to write your methodology or send it to adviser for approval.
                                                </p>
                                                <div className="d-flex justify-content-center">
                                                    {
                                                        methodologyStatus === 'Not Sent' ? (
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
                                                        methodologyStatus === 'Sent' ? (
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
                                                        to={`/thesis-process/${pId}/methodology/${metId}`}
                                                    >
                                                        Edit Methodology
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

export default LiteratureReview;