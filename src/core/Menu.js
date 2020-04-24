import React, { Component } from 'react';
import { Link, withRouter, useHistory } from 'react-router-dom';
import { isAuthenticated, signout } from '../auth';
import { getProcessByUserId } from '../process/apiProcess'
import { createNotification, getNotificationsByUser, readNotification, getReadNotificationsByUser, readAllNotification } from '../notification/apiNotification'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';
import Logo from '../images/ylogo.png';
import DefaultProfile from '../images/avatar.png';
import Loading from '../core/Loading';
import '../css/style.css'
import 'normalize.css'

class Menu extends Component {
    constructor() {
        super();
        this.state = {
            processId: "",
            notifications: [],
            counter: '',
            done: undefined,
            notificationId: '',
            error: '',
            userId: undefined
        };
    }

    componentDidMount() {
        if (isAuthenticated()) {
            const userId = isAuthenticated().user._id
            const token = isAuthenticated().token
            getProcessByUserId(userId, token).then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    if (data.length !== 0) {
                        this.setState({
                            processId: data[0]._id
                        });
                    }
                }
            });
            getNotificationsByUser(userId, token).then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({
                        notifications: data.reverse()
                    });
                    let checkNotification;
                    if (data.length === 0)
                        this.createNotification()
                    else {
                        checkNotification = data.filter(d => d.notification === 'Please upload a profile photo!');
                        if (checkNotification.length === 0)
                            this.createNotification()
                    }
                }
            });
            getReadNotificationsByUser(userId, token).then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({
                        counter: data.length,
                        done: true,
                        userId: isAuthenticated().user._id
                    });
                }
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (isAuthenticated()) {
            const userId = isAuthenticated().user._id
            const token = isAuthenticated().token
            if (!this.state.notificationId === '' && (this.state.notificationId !== prevState.notificationId)) {
                getNotificationsByUser(userId, token).then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        this.setState({
                            notifications: data.reverse(),
                            notificationId: ''
                        });
                    }
                });
                getReadNotificationsByUser(userId, token).then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        this.setState({
                            counter: data.length,
                        });
                    }
                })
            }
        }

    }

    createNotification = () => {
        const token = isAuthenticated().token
        if (isAuthenticated().user.photo.data === undefined) {
            const notificationTo = isAuthenticated().user._id
            const notification = 'Please upload a profile photo!'
            const redirect = `/user/${notificationTo}`
            const notData = { notificationTo, notification, redirect }
            createNotification(token, notData).then(data => {
                if (data.error) {
                    this.setState({ error: data.error });
                }
            });
        }
    }

    read = event => {
        event.preventDefault();
        const isRead = event.target.name
        if (isRead === 'false') {
            const notId = event.target.getAttribute("data-index")
            const token = isAuthenticated().token
            readNotification(notId, token).then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ notificationId: notId })
                }
            });
        }
    }

    readAll = e => {
        e.preventDefault()
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        readAllNotification(userId, token).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ notificationId: userId })
            }
        });

    }

    render() {
        const { processId, userId, notifications, counter, done } = this.state
        const isActive = (history, path) => {
            if (window.location.pathname === path) return { color: "#ff9900" }
            else return { color: "#ffffff" }
        }


        const photoUrl = isAuthenticated() && isAuthenticated().user.photo.data !== undefined ?
            `${process.env.REACT_APP_API_URL}/user/photo/${isAuthenticated().user._id}?
                ${new Date().getTime()}` : DefaultProfile



        return (
            <>
                {
                    isAuthenticated() && !userId ?
                        <Loading done={done} />
                        :
                        <div>
                            {(isAuthenticated() && isAuthenticated().user.userType !== 'admin') || !isAuthenticated() ?
                                window.location.pathname === '/' ?
                                    <header id="home">
                                        <nav>
                                            <div className="row">
                                                <img src={Logo} alt="YSU Online Thesis Management System" className="main-logo" />
                                                <img src={Logo} alt="YSU Online Thesis Management System" className="main-logo-black" />
                                                <ul className="main-nav mr-auto js--main-nav">
                                                    <li><Link className="mainlink" to={'/home'}>Home</Link></li>
                                                    <li><Link className="mainlink" to={"/researches"}>Topics</Link></li>
                                                    <li><Link className="mainlink" to={"/faculty-members"}>Faculty Members</Link></li>
                                                    {isAuthenticated() && (
                                                        processId !== "" ?
                                                            <li>
                                                                <Link className="mainlink" to={`/thesis-process/${processId}`} >Thesis Process</Link>
                                                            </li>
                                                            :
                                                            <li>
                                                                <Link className="mainlink" to={`/thesis-process`} >Thesis Process</Link>
                                                            </li>
                                                    )}
                                                </ul>
                                                <ul className="main-nav main-nav-right js--main-nav">
                                                    {!isAuthenticated() ? (
                                                        <>
                                                            <li><a className="mainlink" href="/signin">Sign In</a></li>
                                                            <li id="signup-button"><a className="mainlink" href="/signup">Sign Up</a></li>

                                                        </>
                                                    ) :
                                                        <>
                                                            <li>
                                                                <Link to={`/user/${isAuthenticated().user._id}`} className="mainlink">
                                                                    <img src={photoUrl} alt={`${isAuthenticated().user.fname}'s profile`} className="home-profile" />
                                                                        My Profile
                                                                </Link>
                                                            </li>
                                                            <li id="notification">
                                                                <Link className="notification" id="notification-button" data-toggle="modal" data-target="#exampleModal">
                                                                    <i className="fas fa-bell"></i><span className="badge badge-danger">{counter}</span>
                                                                </Link>
                                                                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                    <div class="modal-dialog" role="document">
                                                                        <div class="modal-content">
                                                                            <div class="modal-header">
                                                                                <h5 class="modal-title" id="exampleModalLabel">Notifications</h5>
                                                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                                    <span aria-hidden="true">&times;</span>
                                                                                </button>
                                                                            </div>
                                                                            <div class="modal-body">
                                                                                {notifications.map((notification, i) => (
                                                                                    <ul
                                                                                        key={notification._id}
                                                                                        className={!notification.isRead ? 'read' : null}>
                                                                                        <li
                                                                                            id="notifications-list">
                                                                                            {notification.notificationFrom && (
                                                                                                notification.notificationFrom.photo.data === undefined ?
                                                                                                    <img className="notifications-list__photo" id={``} src={DefaultProfile} /> :
                                                                                                    <img className="notifications-list__photo"
                                                                                                        src={`${process.env.REACT_APP_API_URL}/user/photo/${notification.notificationFrom._id}?${new Date().getTime()}`} />

                                                                                            )}
                                                                                            <Link
                                                                                                key={notification._id}
                                                                                                data-index={notification._id}
                                                                                                name={notification.isRead ? 'true' : 'false'}
                                                                                                onMouseOver={this.read}
                                                                                                to={notification.redirect}
                                                                                                target="_blank"
                                                                                                id="notifications-list__btn">
                                                                                                {notification.notification}
                                                                                            </Link>
                                                                                        </li>
                                                                                    </ul>

                                                                                ))}
                                                                            </div>
                                                                            <div class="modal-footer">
                                                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <Link to="/" className="mainlink" onClick={() => {
                                                                    if (typeof window !== 'undefined') window.localStorage.removeItem('jwt');
                                                                    signout()
                                                                }}>Sign Out</Link>
                                                            </li>
                                                        </>
                                                    }

                                                </ul>
                                                <a className="mobile-nav-icon js--nav-icon"><i className="icon ion-md-menu"></i></a>
                                            </div>
                                        </nav>
                                        <div className="text-box">
                                            <h1 className="heading-primary">
                                                <span className="heading-primary-main">Youngstown&nbsp;State&nbsp;University</span>
                                                <blockquote className="blockquote">
                                                    <span className="heading-primary-sub">Web-based Thesis Workflow Management System   </span>
                                                </blockquote>
                                                {!isAuthenticated() ?
                                                    <>
                                                        <Link className="mainbtn mainbtn-full" to="/signup">Get Started</Link>
                                                        <a className="mainbtn mainbtn-ghost js--scroll-to-info" href="#">Learn More</a>

                                                    </> : null
                                                }
                                                {
                                                    isAuthenticated() && (
                                                        processId === "" && isAuthenticated().user.userType === 'student' ?
                                                            <>
                                                                <Link className="mainbtn mainbtn-full" to="/thesis-process">Start Your Process</Link>

                                                            </> : isAuthenticated() && processId !== "" && isAuthenticated().user.userType === 'student' ?
                                                                <>
                                                                    <Link className="mainbtn mainbtn-full" to={`/thesis-process/${processId}`}>Continue Your Study</Link>

                                                                </> : isAuthenticated().user.userType === 'faculty' ?
                                                                    <>
                                                                        <Link className="mainbtn mainbtn-full" to={`/user/${isAuthenticated().user._id}`}>Go To Profile</Link>
                                                                    </> : ''
                                                    )
                                                }
                                            </h1>
                                        </div>
                                    </header>
                                    :
                                    <nav className="secondary_sticky">
                                        <div className="row">
                                            <img src={Logo} alt="YSU Online Thesis Management System" className="secondary-logo-black" />
                                            <ul className="main-nav mr-auto js--main-nav">
                                                <li>
                                                    <Link className="mainlink" to="/">Home</Link>
                                                </li>
                                                <li>
                                                    <Link className="mainlink" style={isActive(window.location.pathname, "/researches")} to="/researches">Topics</Link>
                                                </li>
                                                <li>
                                                    <Link className="mainlink" style={isActive(window.location.pathname, "/faculty-members")} to="/faculty-members">Faculty Members</Link>
                                                </li>
                                                {isAuthenticated() && (
                                                    <>
                                                        <li>
                                                            <Link className="mainlink"
                                                                style={isActive(window.location.pathname, `/thesis-process/${processId}`)}
                                                                to={`/thesis-process/${processId}   `} >
                                                                Thesis Process
                                        </Link>
                                                        </li>
                                                    </>
                                                )}
                                            </ul>
                                            <ul className="main-nav main-nav-right js--main-nav">
                                                {!isAuthenticated() ? (
                                                    <>
                                                        <li>
                                                            <Link className="mainlink" style={isActive(window.location.pathname, "/signin")} to="/signin">Sign In</Link>
                                                        </li>
                                                        <li>
                                                            <Link className="mainlink" style={window.location.pathname === '/signup' ||
                                                                window.location.pathname === '/signup/faculty' ||
                                                                window.location.pathname === '/signup/student' ?
                                                                { color: "#ff9900" } : { color: "#ffffff" }} to="/signup">Sign Up
                                    </Link>
                                                        </li>

                                                    </>
                                                ) :
                                                    <>
                                                        <li>
                                                            <Link className="mainlink"
                                                                style={window.location.pathname === `/user/${isAuthenticated().user._id}` ||
                                                                    window.location.pathname === `/user/${isAuthenticated().user._id}/request` ||
                                                                    window.location.pathname === `/user/${isAuthenticated().user._id}/permission` ||
                                                                    window.location.pathname === `/user/${isAuthenticated().user._id}/thesis-form` ||
                                                                    window.location.pathname === `/user/${isAuthenticated().user._id}` ?
                                                                    { color: "#ff9900" } : { color: "#ffffff" }}
                                                                to={`/user/${isAuthenticated().user._id}`}>
                                                                <img src={photoUrl} alt={`${isAuthenticated().user.fname}'s profile`} className="home-profile" />
                                                                        My Profile
                                                                </Link>
                                                        </li>
                                                        <li id="notification">
                                                            <Link className="notification" id="notification-button" data-toggle="modal" data-target="#exampleModal">
                                                                <i className="fas fa-bell"></i><span className="badge badge-danger">{counter}</span>
                                                            </Link>
                                                            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                <div class="modal-dialog" role="document">
                                                                    <div class="modal-content">
                                                                        <div class="modal-header">
                                                                            <h5 class="modal-title" id="exampleModalLabel">Notifications</h5>
                                                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                                <span aria-hidden="true">&times;</span>
                                                                            </button>
                                                                        </div>
                                                                        <div class="modal-body">
                                                                            {notifications.map((notification, i) => (
                                                                                <ul
                                                                                    key={notification._id}
                                                                                    className={!notification.isRead ? 'read' : null}>
                                                                                    <li
                                                                                        id="notifications-list">
                                                                                        {notification.notificationFrom && (
                                                                                            notification.notificationFrom.photo.data === undefined ?
                                                                                                <img className="notifications-list__photo" id={``} src={DefaultProfile} /> :
                                                                                                <img className="notifications-list__photo"
                                                                                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${notification.notificationFrom._id}?${new Date().getTime()}`} />

                                                                                        )}
                                                                                        <Link
                                                                                            key={notification._id}
                                                                                            data-index={notification._id}
                                                                                            name={notification.isRead ? 'true' : 'false'}
                                                                                            onMouseOver={this.read}
                                                                                            to={notification.redirect}
                                                                                            target="_blank"
                                                                                            id="notifications-list__btn">
                                                                                            {notification.notification}
                                                                                        </Link>
                                                                                    </li>
                                                                                </ul>

                                                                            ))}
                                                                        </div>
                                                                        <div class="modal-footer">
                                                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <Link to="/" className="mainlink" onClick={() => {
                                                                if (typeof window !== 'undefined') window.localStorage.removeItem('jwt');
                                                                signout()
                                                            }}>Sign Out</Link>
                                                        </li>
                                                    </>
                                                }

                                            </ul>
                                            <a className="mobile-nav-icon js--nav-icon"><i className="icon ion-md-menu"></i></a>
                                        </div>
                                    </nav>
                                : null
                            }
                        </div>
                }
            </>
        );
    }

}

export default withRouter(Menu);
