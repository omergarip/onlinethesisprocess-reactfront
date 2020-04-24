import React, { Component } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { getProcessByUserId } from './apiProcess';
import { getThesisByProcessId, createThesis, updateThesis } from '../thesis/apiThesis'

class Thesis extends Component {
    constructor() {
        super();
        this.state = {
            process: [],
            thesis: undefined,
            newThesis: undefined,
            isFinal: undefined,
            finalStatus: undefined,
            thesisId: undefined,
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
                getThesisByProcessId(data[0]._id, token).then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        if (data.length === 0)
                            this.setState({ newThesis: true })
                        else
                            this.setState({
                                thesis: data[0],
                                thesisId: data[0]._id,
                                isFinal: data[0].isFinal,
                                finalStatus: data[0].finalStatus
                            })
                        console.log(data[0])

                    }
                })
            }
        });

    }

    create = event => {
        event.preventDefault();
        const processId = this.state.process._id
        const studentId = isAuthenticated().user._id
        const token = isAuthenticated().token
        const adviserId = this.state.process.adviserId._id
        const thesis = { processId, adviserId, studentId }
        createThesis(processId, token, thesis).then(data => {
            if (data.error)
                console.log(data.error)
            else {
                window.location.href = `/thesis-process/${processId}/thesis/${data._id}/chapters`
            }
        })
    }

    finalApproval = event => {
        event.preventDefault();
        const studentId = isAuthenticated().user._id;
        const thesisId = this.state.thesisId
        const token = isAuthenticated().token
        let finalStatus = this.state.finalStatus
        if (finalStatus === 'Not Sent') {
            finalStatus = 'Sent'
        }
        else {
            finalStatus = 'Not Sent'
        }
        const thesis = { studentId, finalStatus }
        console.log(thesis)
        updateThesis(thesisId, token, thesis).then(data => {
            if (data.error)
                console.log(data.error)
            else {
                this.setState({ finalStatus: data.finalStatus })
            }
        })
    }

    render() {
        const { process, finalStatus, newThesis, isFinal, thesisId } = this.state;

        return (
            <>
                {process.topicId && process.adviserId && process.formId ?
                    <div className={
                        this.state.active ? 'accordion-item active' : 'accordion-item'
                    }>
                        <button className={isFinal ? 'done title' : 'title'} onClick={() => this.setState({ active: !this.state.active })}>
                            Thesis {isFinal ? <span class="checkmark">&#10003;</span> : ''}
                        </button>
                        <div className="panel">
                            {newThesis ?
                                <>
                                    <p className="lead process-text text-center">
                                        Now, It's time to start writing your thesis.
                                    </p>
                                    <p className="lead process-text text-center">
                                        Click button to start writing.
                                    </p>
                                    <div className="process__btn-center">
                                        <button
                                            onClick={this.create}
                                            className="btn-purple" id="process__btn">
                                            Create Thesis
                                        </button>
                                    </div>
                                </>
                                : !newThesis ?
                                    <div>
                                        <div className='row'>
                                            {
                                                finalStatus === 'Not Sent' || finalStatus === 'Sent' ?
                                                    <>
                                                        <div className='col-md-6'>
                                                            <p className="lead process-text text-center">
                                                                Continue working on your thesis
                                                        </p>
                                                            <div className="d-flex justify-content-center">
                                                                <Link
                                                                    className="btn btn-info rounded"
                                                                    to={`/thesis-process/${process._id}/thesis/${thesisId}/chapters`}
                                                                >
                                                                    Continue
                                                            </Link>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-6 thesis_border'>
                                                            <p className="lead process-text text-center">
                                                                If you finish your study, send it to your advisor for final revision
                                                        </p>
                                                            <div className="d-flex flex-column align-items-center justify-content-center">
                                                                <button
                                                                    className={`btn rounded ${finalStatus === 'Not Sent' ? 'btn-primary' : 'btn-warning disabled'} `}
                                                                    onClick={this.finalApproval}
                                                                >
                                                                    {finalStatus === 'Not Sent' ? 'Send' : 'Waiting for approval'}

                                                                </button>
                                                                {finalStatus === 'Sent' ?
                                                                    <a
                                                                        onClick={this.finalApproval}
                                                                        id="cancelPermission"
                                                                        className="">
                                                                        Click here to cancel it
                                                                    </a>
                                                                    : null
                                                                }
                                                            </div>
                                                        </div>
                                                    </>
                                                    : finalStatus === 'Approved' ?
                                                        <div className="col-12">
                                                            <p className="lead process-text text-center">
                                                                You completed your study successfully. You can still view your thesis.
                                                            </p>
                                                            <div className="d-flex justify-content-center">
                                                                <Link
                                                                    className="btn btn-info rounded"
                                                                    to={`/thesis-process/${process._id}/thesis/${thesisId}/chapters`}
                                                                >
                                                                    View
                                                            </Link>
                                                            </div>
                                                        </div> : null
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

export default Thesis;