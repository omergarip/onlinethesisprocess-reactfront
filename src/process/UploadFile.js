import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { getProcessByUserId, updateCommitteeStatus, } from './apiProcess';
import { createCommittee, getCommitteeByStudentId, updateDate } from '../committee/apiCommittee'

class UploadFile extends Component {
    constructor() {
        super();
        this.state = {
            process: '',
            members: [],
            loading: false,
            status: '',
            pId: '',
            cId: '',
            isApproved: undefined,
            thesisId: '',
            committeeStatus: '',
            newCommitee: undefined,
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
                console.log(data)
                this.setState({
                    process: data[0],
                    pId: this.props.pId,
                    thesisId: data[0].thesisId,
                    loading: false
                });
            }
        });
        let isApproved;
        let committeeId
        getCommitteeByStudentId(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                if (data.length === 0) {
                    this.setState({ newCommitee: true })
                } else {
                    committeeId = data[0]._id
                    data[0].members.map(member => {
                        if (!member.isApproved)
                            isApproved = false;
                        else
                            isApproved = true
                    })
                    this.setState({
                        members: data[0].members,
                        cId: data[0]._id,
                        isApproved: isApproved
                    })
                }
            }
        });
        console.log(isApproved)


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
                            process: data[0],
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
        const studentId = userId
        const memberId = this.state.process.adviserId._id
        const status = 'Approved';
        const isApproved = false
        const members = { memberId, status, isApproved }
        const committee = { studentId, members }
        createCommittee(userId, token, committee).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    loading: false
                });
                window.location.href = `/thesis-process/${pId}/committee-members`
            }
        });
    };

    checkApproval = e => {
        e.preventDefault();
        if (this.state.isApproved) {
            const cId = this.state.cId;
            const token = isAuthenticated().token
            const finalStatus = true
            const data = { finalStatus }
            updateDate(cId, token, data).then(data => {
                if (data.error)
                    console.log(data.error)
                else {
                    this.setState({
                        added: cId,
                        done: true
                    })
                    updateCommitteeStatus(this.state.pId, cId, token)
                    window.location.href = `/thesis-process/${this.state.pId}/committee-members`
                }
            })
        }
    }

    redirectToTarget = (pId) => {
        this.props.history.push(`/thesis-process/${pId}/committee-members`)
    }

    render() {
        const { process, pId, cId, thesisId, newCommitee, redirectToProfile } = this.state;
        if (redirectToProfile)
            this.redirectToTarget(pId)

        return (
            <>
                {process.topicId && process.adviserId && process.formId && process.committeeId ?
                    <div className={
                        this.state.active ? 'accordion-item active' : 'accordion-item'
                    }>
                        <button className={process.committeeId ? 'done title' : 'title'} onClick={() => this.setState({ active: !this.state.active })}>
                            Upload Your Final Thesis/Dissertation Document {process.committeeId ? <span class="checkmark">&#10003;</span> : ''}
                        </button>
                        <div className="panel">
                            {newCommitee ?
                                <>
                                    <p className="lead process-text text-center">
                                        Now, It's time to form your committee.
                                    </p>
                                    <p className="lead process-text text-center">
                                        Click button to choose your committee members.
                                    </p>
                                    <div className="process__btn-center">
                                        <button
                                            onClick={this.clickSubmit}
                                            className="btn-purple" id="process__btn">
                                            Form Committee
                                        </button>
                                    </div>
                                </>
                                : !newCommitee ?
                                    <div>
                                        <div className='row'>
                                            {

                                                <>
                                                    <div className='col-md-12'>
                                                        <p className="lead process-text text-center">
                                                            Continue forming your committee
                                                        </p>
                                                        <div className="d-flex justify-content-center">
                                                            <Link
                                                                onClick={this.checkApproval}
                                                                className="btn btn-info rounded"
                                                                to={`/thesis-process/${process._id}/committee-members`}
                                                            >
                                                                Continue
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </>


                                            }
                                        </div>

                                    </div>
                                    : null
                            }
                        </div>
                    </div> : null
                }
            </>
        );
    }
};

export default UploadFile;