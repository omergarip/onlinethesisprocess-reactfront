import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { getThesisByProcessId, createThesis, updateChapter } from './apiThesis';
import { getProcess } from '../process/apiProcess';
import { Redirect } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import Loading from '../core/Loading';

import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import parse from 'html-react-parser'

import Diff from 'react-stylable-diff'



class CheckRevision extends Component {
    constructor() {
        super();
        this.state = {
            body: '',
            revisedBody: '',
            stripedBody: '',
            stripedRevisedBody: '',
            revisedTitle: '',
            revisedBody: '',
            message: '',
            thesisId: '',
            error: '',
            adviserId: '',
            loading: false,
            redirectToProfile: false
        };
    }

    componentDidMount() {
        const pId = this.props.match.params.pId;
        const token = isAuthenticated().token;
        getThesisByProcessId(pId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    adviserId: data[0].adviserId,
                    references: data[0].references,
                    done: true
                });
                const chapters = data[0].chapters
                chapters.map(chapter => {

                    if (chapter._id === this.props.match.params.chapterId) {
                        var StrippedString = chapter.body.replace(/(<([^>]+)>)/ig, "");
                        var StrippedString2 = chapter.revisedBody.replace(/(<([^>]+)>)/ig, "");
                        this.setState({
                            body: chapter.body,
                            stripedBody: StrippedString,
                            stripedRevisedBody: StrippedString2,
                            message: chapter.message,
                            revisedBody: chapter.revisedBody,
                            revisedTitle: chapter.revisedTitle
                        })
                    }

                })
            }
        });
    }



    update = (chapters) => {
        const thesisId = this.props.match.params.thesisId;
        const token = isAuthenticated().token;
        const chapterId = this.props.match.params.chapterId
        const newReferences = this.state.newReferences
        updateChapter(thesisId, token, chapters, chapterId, newReferences).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    done: true,
                    redirectToProfile: true
                })
            }
        });
    }

    acceptChanges = event => {
        event.preventDefault();
        const { revisedBody, revisedTitle, message } = this.state
        let body = revisedBody
        let title = revisedTitle
        let status = 'Approved'
        const chapters = {
            title, body, message, status
        }
        console.log(chapters)
        this.update(chapters)
    }


    redirectToTarget = (pId, thesisId) => {
        if (isAuthenticated().user._id === this.state.adviserId)
            this.props.history.push(`/user/${isAuthenticated().user._id}/thesis-approval`)
        else
            this.props.history.push(`/thesis-process/${pId}/thesis/${thesisId}/chapters`)
    }



    SeeChanges = (body, revisedBody, message) => (
        <>
            <section>
                <div className="row">

                    <h2 className="text-center w-100">Message From your advisor</h2>

                    <p>{ReactHtmlParser(message)}</p>

                    <div className="col-md-12">
                        <button
                            onClick={this.acceptChanges}
                            className="btn btn-info">Accept Changes</button>
                        <h2>Revised</h2>
                        < Diff inputB={`${body}`} inputA={`${revisedBody}`} type="chars" />
                    </div>



                </div>
            </section>


        </>
    )

    render() {
        const { body, message, redirectToProfile, error, done, stripedBody, stripedRevisedBody } = this.state;
        const pId = this.props.match.params.pId;
        const thesisId = this.props.match.params.thesisId;
        if (redirectToProfile) {
            this.redirectToTarget(pId, thesisId)
        }



        return (
            <> {
                !body ?
                    <Loading done={done} />
                    :
                    <section className="section__create-chapter">
                        <div className="container" id="thesis">
                            <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
                                {error}
                            </div>
                            {this.SeeChanges(stripedBody, stripedRevisedBody, message)}


                        </div>
                    </section>
            }



            </>
        );
    }
}

export default CheckRevision;