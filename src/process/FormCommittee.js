import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { getProcessByUserId, updateCommitteeStatus, createCommittee, getCommitteeByStudentId } from './apiProcess';

class FormCommittee extends Component {
	constructor() {
		super();
		this.state = {
            process: [],
            introId: '',
            loading: false,
            status: '',
            pId: '',
            cId: '',
            methodologyStatus: '',
            committeeStatus: '',
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
                if (data[0].methodologyId !== undefined)
                    this.setState({ 
                        process : data[0],
                        pId: this.props.pId,
                        cId: data[0].committeeId._id,
                        methodologyStatus: data[0].methodologyId.status,
                        committeeStatus: data[0].committeeId.status,
                        loading: false
                    });	
			}
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state != nextState;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.process === prevState.process) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            getProcessByUserId(userId, token).then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    if (data[0].methodologyId !== undefined)
                    this.setState({ 
                        process : data[0],
                        pId: this.props.pId,
                        cId: data[0].committeeId._id,
                        methodologyStatus: data[0].methodologyId.status,
                        committeeStatus: data[0].committeeId.status,
                        loading: false
                    });	
                }
            });
        }
    }
    
    clickSubmit = event => {
        event.preventDefault();
        const pId = this.props.pId
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const studentId = isAuthenticated().user._id;
        const cMemberId = this.state.process.adviserId._id
        const committee = { studentId, cMemberId }
        createCommittee(userId, token, committee).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                getCommitteeByStudentId(userId, token).then(data => {
                    if (data.error) {
                        this.setState({ error: data.error });
                    } else { 
                        const cId = data[0]._id
                        updateCommitteeStatus(pId, cId, token).then(data => {
                            if (data.error) {
                                this.setState({ error: data.error });
                            } else { 
                                this.setState({ 
                                    loading: false,
                                    redirectToProfile: true
                                });
                            }
                        })
                    }
                })
            }
        });
    };

    redirectToTarget = (pId) => {
		this.props.history.push(`/thesis-process/${pId}/committee-members`)
	}

	render() {
        const { process, pId, cId, methodologyStatus, committeeStatus, redirectToProfile} = this.state;
        // if(redirectToProfile)
        //     this.redirectToTarget(pId)

		return (
            <>
            
                {   methodologyStatus === 'Approved' ? (	
                    <div>	
                        <div class="panel-heading mt-4" role="tab" id="headingOne">
                            <h4 class="panel-title">
                                <a className={committeeStatus === 'Approved' ? "collapsed status" : "collapsed"} role="button" data-toggle="collapse" 
                                data-parent="#accordion" href="#collapseSeven" aria-expanded="true" aria-controls="collapseSeven">
                                    Form Your Committee { committeeStatus === 'Approved' ? <span class="checkmark">&#10003;</span> : ''}
                                </a>
                            </h4>
                        </div>
                        <div id="collapseSeven" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                            <div class="panel-body">
                                {
                                    process.committeeId === undefined ? 
                                    <div>
                                        <p className="lead process-text text-center">
                                            Now, It's time to form your committee.
                                        </p>
                                        <p className="lead process-text text-center">
                                            Click button to choose your committee members.
                                        </p>
                                        <div className="d-flex justify-content-center">
                                            <button
                                                id="process__link"
                                                onClick={this.clickSubmit}
                                                className="btn btn-info mr-4"
                                            >
                                                Form Committee
                                            </button>
                                        </div>
                                    </div> : 
                                    <div>
                                        {      
                                            committeeStatus === 'Not Sent' ? (
                                                <>
                                                <p className="lead process-text text-center">
                                                    You didn't send invitation to the committee members. Click here to either update committee members or send invitation.
                                                </p>
                                                <div className="d-flex justify-content-center">
                                                    <Link
                                                        to={`/thesis-process/${pId}/committee-members/${cId}`}
                                                        id="process__link"
                                                        className="btn btn-info mr-4"
                                                    >
                                                        Review Committee Members.
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
                                                        committeeStatus === 'Not Sent' ? (
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
                                                        committeeStatus  === 'Sent' ? (
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
                                                        to={`/thesis-process/${pId}/methodology/`}
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

export default FormCommittee;