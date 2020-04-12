import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { getProcessByUserId } from './apiProcess';
import { updateReviewStatus } from '../thesis/apiThesis';

class LiteratureReview extends Component {
	constructor() {
		super();
		this.state = {
            process: [],
            pId: '',
            reviewId: '',
            loading: false,
            introStatus: '',
            reviewStatus: '',
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
                if(data[0].reviewId === undefined && data[0].introId !== undefined)
                    this.setState({ 
                        process : data[0],
                        pId : data[0]._id,
                        introStatus: data[0].introductionId.status,
                        loading: false
                    });	
                if(data[0].reviewId !== undefined)
                    this.setState({ 
                        process : data[0],
                        pId : data[0]._id,
                        reviewId: data[0].reviewId._id,
                        introStatus: data[0].introductionId.status,
                        reviewStatus: data[0].reviewId.status,
                        loading: false
                    });	
			}
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state != nextState;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.reviewStatus === prevState.reviewStatus) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            getProcessByUserId(userId, token).then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    if(data[0].reviewId === undefined)
                        this.setState({ 
                            process : data[0],
                            pId : data[0]._id,
                            introStatus: data[0].introductionId.status,
                            loading: false
                        });	
                    if(data[0].reviewId !== undefined)
                        this.setState({ 
                            process : data[0],
                            pId : data[0]._id,
                            reviewId: data[0].reviewId._id,
                            introStatus: data[0].introductionId.status,
                            reviewStatus: data[0].reviewId.status,
                            loading: false
                        });	
                }
            });
        }
    }
    
    clickSubmit = event => {
        event.preventDefault();
        const reviewId = this.state.reviewId;
        const token = isAuthenticated().token;
        const status = 'Sent'
        const review = { status }
        updateReviewStatus(reviewId, token, review).then(data => {
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
        const { process, pId, reviewId, introStatus, reviewStatus} = this.state;
        
		return (
            <>
            
                {   introStatus === 'Approved' ? (	
                    <div>	
                        <div class="panel-heading mt-4" role="tab" id="headingOne">
                            <h4 class="panel-title">
                                <a className={reviewStatus === 'Approved' ? "collapsed status" : "collapsed"} role="button" data-toggle="collapse" 
                                data-parent="#accordion" href="#collapseFive" aria-expanded="true" aria-controls="collapseFive">
                                    Literature Review { reviewStatus === 'Approved' ? <span class="checkmark">&#10003;</span> : ''}
                                </a>
                            </h4>
                        </div>
                        <div id="collapseFive" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                            <div class="panel-body">
                                {
                                    process.reviewId === undefined ? 
                                    <div>
                                        <p className="lead process-text text-center">
                                            Now, Continue with Literature Review.
                                        </p>
                                        <p className="lead process-text text-center">
                                            Click button to write Literature Review.
                                        </p>
                                        <div className="d-flex justify-content-center">
                                            <Link
                                                to={`/thesis-process/${pId}/literature-review`}
                                                className="btn-purple" id="process__btn">
                                                    Write Literature Review
                                            </Link>
                                        </div>
                                    </div> : 
                                    <div>
                                        {   
                                            
                                            reviewStatus === 'Approved' ? (
                                                <>
                                                <p className="lead process-text text-center">
                                                    Your literature review is approved. However, You can still edit it.
                                                </p>
                                                <div className="d-flex justify-content-center">
                                                    <Link
                                                        id="process__link"
                                                        className="btn btn-warning"
                                                        to={`/thesis-process/${pId}/literature-review/${reviewId}`}
                                                    >
                                                        Edit Literature Review
                                                    </Link>
                                                </div>
                                                </>
                                            ) : (
                                                <>
                                                <p className="lead process-text text-center">
                                                    Here, You can either continue to write your literature review or send it to adviser for approval.
                                                </p>
                                                <div className="d-flex justify-content-center">
                                                    {
                                                        reviewStatus === 'Not Sent' ? (
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
                                                        reviewStatus === 'Sent' ? (
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
                                                        to={`/thesis-process/${pId}/literature-review/${reviewId}`}
                                                    >
                                                        Edit Literature Review
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