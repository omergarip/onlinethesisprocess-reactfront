import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isAuthenticated, signout } from '../auth';
import { getProcessByUserId } from '../process/apiProcess'
import { create, getNotificationsByUser, readNotification, getReadNotificationsByUser, readAllNotification } from '../notification/apiNotification'
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
            loading: true,
            notificationId: '',
            error: ''
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
                        console.log(data[0]._id)
                        this.setState({
                            processId: data[0]._id,
                            loading: false
                        });
                    }

                }
            });
            getNotificationsByUser(userId, token).then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({
                        notifications: data.reverse(),
                        loading: false
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
                        counter: data.length
                    });
                }
            })
            this.setState({
                loading: false
            });
        } else {
            this.setState({ loading: false })
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
                            notificationId: '',
                            loading: false,
                        });
                    }
                });
                getReadNotificationsByUser(userId, token).then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        this.setState({
                            counter: data.length
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
            create(token, notData).then(data => {
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
        const { processId, loading, notifications, counter, redirect } = this.state
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
                    loading ?
                        <Loading />
                        :

                        <div>
                            {
                                window.location.pathname === '/' ?
                                    <header id="home">
                                        <nav>
                                            <div className="row">
                                                <img src={Logo} alt="YSU Online Thesis Management System" className="main-logo" />
                                                <img src={Logo} alt="YSU Online Thesis Management System" className="main-logo-black" />
                                                <ul className="main-nav mr-auto js--main-nav">
                                                    <li><Link className="mainlink" to={'/home'}>Home</Link></li>
                                                    <li><Link className="mainlink" to={"/researches"}>Research Topics</Link></li>
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
                                                                <Link className="notification" id="notification-button">
                                                                    <i className="fas fa-bell"></i><span className="badge badge-danger">{counter}</span>
                                                                </Link>
                                                                <div id="notifications">
                                                                    <div id="notifications-header">
                                                                        <h3>Notifications</h3>
                                                                        <button
                                                                            onClick={this.readAll}
                                                                            id="notifications-header__btn"
                                                                        >
                                                                            Mark as read
                                                                        </button>
                                                                    </div>
                                                                    <div style={{ height: '30rem' }}>
                                                                        {notifications.map((notification, i) => (

                                                                            <ul
                                                                                key={notification._id}
                                                                                className={!notification.isRead ? 'read' : null}>
                                                                                <li
                                                                                    id="notifications-list">

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

                                                                    <div className="seeAll"><a href="#">See All</a></div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <Link to="/" className="mainlink" onClick={() => signout('/')}>Sign Out</Link>
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
                                                    <span className="heading-primary-sub">Web-based Thesis Process Workflow Management System   </span>
                                                </blockquote>
                                                {!isAuthenticated() ?
                                                    <>
                                                        <Link className="mainbtn mainbtn-full" to="/signup">Get Started</Link>
                                                        <a className="mainbtn mainbtn-ghost js--scroll-to-info" href="#">Learn More</a>

                                                    </> : isAuthenticated() && processId === "" && isAuthenticated().user.userType === 'student' && !loading ?
                                                        <>
                                                            <Link className="mainbtn mainbtn-full" to="/thesis-process">Start Your Process</Link>

                                                        </> : isAuthenticated() && processId !== "" && isAuthenticated().user.userType === 'student' && !loading ?
                                                            <>
                                                                <Link className="mainbtn mainbtn-full" to={`/thesis-process/${processId}`}>Continue Your Study</Link>

                                                            </> : isAuthenticated().user.userType === 'faculty' ?
                                                                <>
                                                                    <Link className="mainbtn mainbtn-full" to={`/user/${isAuthenticated().user._id}`}>Go To Profile</Link>
                                                                </> : ''
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
                                                    <Link className="mainlink" style={isActive(window.location.pathname, "/researches")} to="/researches">Research Topics</Link>
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
                                                            <Link className="notification" id="notification-button">
                                                                <i className="fas fa-bell"></i><span className="badge badge-danger">{counter}</span>
                                                            </Link>
                                                            <div id="notifications">
                                                                <div id="notifications-header">
                                                                    <h3>Notifications</h3>
                                                                    <button
                                                                        onClick={this.readAll}
                                                                        id="notifications-header__btn"
                                                                    >
                                                                        Mark as read
                                                                        </button>
                                                                </div>
                                                                <div style={{ height: '30rem' }}>
                                                                    {notifications.map((notification, i) => (

                                                                        <ul
                                                                            key={notification._id}
                                                                            className={!notification.isRead ? 'read' : null}>
                                                                            <li
                                                                                id="notifications-list">

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

                                                                <div className="seeAll"><a href="#">See All</a></div>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                className="mainlink"
                                                                style={
                                                                    (isActive(window.location.pathname, "/signout"),
                                                                        { cursor: "pointer", color: "#fff" })
                                                                }
                                                                onClick={() => signout('/')}>
                                                                Sign Out
                                                             </Link>
                                                        </li>
                                                    </>
                                                }

                                            </ul>
                                            <a className="mobile-nav-icon js--nav-icon"><i className="icon ion-md-menu"></i></a>
                                        </div>
                                    </nav>
                            }
                        </div>
                }
            </>
        );
    }

}

export default withRouter(Menu);
