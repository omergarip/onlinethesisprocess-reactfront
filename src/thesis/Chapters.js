import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth';
import { getThesisByProcessId, updateChapter } from './apiThesis';
import Loading from '../core/Loading';
import { createNotification, removeByUser } from '../notification/apiNotification'
import { Editor } from '@tinymce/tinymce-react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

class Chapters extends Component {
    constructor() {
        super();
        this.state = {
            thesisId: '',
            error: '',
            adviserId: '',
            chapters: [],
            isApproved: undefined,
            lastId: undefined,
            lastChapter: '',
            length: '',
            done: undefined,
            revisedTitle: '',
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
                if (data[0].chapters.length === 0)
                    this.setState({
                        length: 0,
                        thesisId: data[0]._id,
                        adviserId: data[0].adviserId,
                        chapters: undefined,
                        done: true
                    })
                else {
                    const length = data[0].chapters.length
                    this.setState({
                        thesisId: data[0]._id,
                        chapters: data[0].chapters,
                        isApproved: data[0].chapters[length - 1].status,
                        lastId: data[0].chapters[length - 1]._id,
                        lastChapter: data[0].chapters[length - 1],
                        adviserId: data[0].adviserId,
                        revisedTitle: data[0].chapters[length - 1].revisedTitle,
                        done: true
                    });
                }

            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.chapters === prevState.chapters) {
            const pId = this.props.match.params.pId;
            const token = isAuthenticated().token;
            getThesisByProcessId(pId, token).then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    if (data[0].chapters.length === 0)
                        this.setState({
                            length: 0,
                            thesisId: data[0]._id,
                            adviserId: data[0].adviserId,
                            done: true
                        })
                    else {
                        const length = data[0].chapters.length
                        this.setState({
                            thesisId: data[0]._id,
                            chapters: data[0].chapters,
                            isApproved: data[0].chapters[length - 1].status,
                            lastId: data[0].chapters[length - 1]._id,
                            lastChapter: data[0].chapters[length - 1],
                            adviserId: data[0].adviserId,
                            done: true
                        });
                    }

                }
            });
        }
    }

    createNotification = (notificationTo) => {
        const token = isAuthenticated().token
        const notificationFrom = isAuthenticated().user._id
        const notification = `${isAuthenticated().user.fname} ${isAuthenticated().user.lname} requested revision. Please click here to respond.`
        const redirect = `user/${notificationTo}/chapter-approval`
        const notData = { notificationTo, notificationFrom, notification, redirect }
        createNotification(token, notData).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            }
        });
    }

    deleteNotification = (notificationFrom) => {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        const notification = `${isAuthenticated().user.fname} ${isAuthenticated().user.lname} requested revision. Please click here to respond.`
        const notData = { notificationFrom, notification }
        removeByUser(userId, token, notData).then(err => {
            if (err)
                console.log(err)
        })
    }

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ done: undefined });
        const { lastChapter, lastId, thesisId, adviserId } = this.state
        const title = lastChapter.title
        const body = lastChapter.body
        const status = 'Sent'
        const chapters = { title, body, status }
        const token = isAuthenticated().token;
        updateChapter(thesisId, token, chapters, lastId).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    done: true,
                    chapters: data[0]
                })
            }
        });
        this.createNotification(adviserId)
    };

    cancelPermission = event => {
        event.preventDefault();
        this.setState({ done: undefined });
        const { lastChapter, lastId, thesisId } = this.state
        const title = lastChapter.title
        const body = lastChapter.body
        const status = 'Not Sent'
        const chapters = { title, body, status }
        const token = isAuthenticated().token;
        console.log(chapters, lastId)
        updateChapter(thesisId, token, chapters, lastId).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    done: true,
                    chapters: data[0]
                })
            }
        });
        this.deleteNotification(isAuthenticated().user._id)
    };

    render() {
        const { error, done, length, chapters, thesisId, isApproved, lastId } = this.state;
        const pId = this.props.match.params.pId;

        return (
            <>
                {!done ?
                    <Loading done={done} />
                    :
                    <section id="section__chapters">
                        <div className="container-fluid" id="thesis">
                            <h2>Thesis</h2>
                            <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
                                {error}
                            </div>
                            {isAuthenticated().user.userType === 'student' ?
                                (length === 0 || isApproved === 'Approved') ?

                                    <div className="add-chapter__send d-flex justify-content-center">
                                        <Link
                                            to={`/thesis-process/${pId}/thesis/${thesisId}/chapter/new`}
                                            className="btn btn-info">
                                            Add Chapter
                                            </Link>
                                    </div> :
                                    <div className="add-chapter">
                                        <div className="add-chapter__button d-flex justify-content-center">
                                            <Link
                                                to={`/thesis-process/${pId}/thesis/${thesisId}/chapter/new`}
                                                className="btn btn-info disabled">
                                                Add Chapter
                                                </Link>
                                            {
                                                isApproved === 'Not Sent' ?
                                                    <button className="btn btn-primary"
                                                        onClick={this.clickSubmit}
                                                    >
                                                        Send it for Approval
                                                        </button>
                                                    : isApproved === 'Sent' ?
                                                        <div className='add-chapter__link'>
                                                            <button className="btn btn-warning disabled">
                                                                Waiting for Approval
                                                                </button>
                                                            <a
                                                                name={lastId}
                                                                onClick={this.cancelPermission}
                                                                id="cancelPermission"
                                                                className="">
                                                                Click here to cancel it
                                                                </a>
                                                        </div>
                                                        : null
                                            }

                                        </div>
                                        <p>* You can't create next chapter until current chapter is approved</p>
                                    </div>
                                : null
                            }



                            <hr />

                            {chapters !== undefined ?
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                            {chapters.map(element => (
                                                <>
                                                    <a
                                                        className="nav-link"
                                                        id={`v-pills-${element._id}-tab`}
                                                        data-toggle="pill" href={`#v-pills-${element._id}`}
                                                        role="tab" aria-controls={`#v-pills-${element._id}`}
                                                        aria-selected="true">
                                                        {element.title}
                                                    </a>
                                                </>
                                            ))}
                                        </div>

                                    </div>
                                    <div class="col-md-9">
                                        <div class="tab-content" id="v-pills-tabContent">
                                            {
                                                chapters.map(element => (
                                                    <>

                                                        <div
                                                            class="tab-pane fade"
                                                            id={`v-pills-${element._id}`}
                                                            role="tabpanel"
                                                            aria-labelledby={`v-pills-${element._id}-tab`}>
                                                            {!element.revisedTitle ?
                                                                <Link
                                                                    to={`/thesis-process/${this.props.match.params.pId}/thesis/${thesisId}/chapter/${element._id}`}
                                                                    className="btn btn-warning mb-5"
                                                                >Modify</Link> :
                                                                <Link
                                                                    to={`/thesis-process/${this.props.match.params.pId}/thesis/${thesisId}/chapter/${element._id}/revision`}
                                                                    className="btn btn-warning mb-5"
                                                                >See Changes</Link>
                                                            }

                                                            {ReactHtmlParser(element.body)}
                                                        </div>
                                                    </>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                                : null
                            }








                        </div>
                    </section>
                }
            </>


        );
    }
}

export default Chapters;