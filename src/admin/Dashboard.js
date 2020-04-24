import React, { Component } from 'react';
import { isAuthenticated, signout } from '../auth';
import { Redirect, Link } from "react-router-dom";
import { getAdviserByStudentId, create, remove } from "../adviser/apiAdviser";
import { read } from "../user/apiUser";
import { createNotification, getNotificationsByUser, readNotification, getReadNotificationsByUser, readAllNotification } from '../notification/apiNotification'
import DefaultProfile from '../images/avatar.png';
import Logo from '../images/ylogo.png';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import '../css/style.css'
import 'normalize.css'
import Users from './AdminUsers';
import Sidebar from './Sidebar';



class Dashboard extends Component {
    constructor() {
        super()
        this.state = {
            user: "",
            notifications: [],
            introduction: "",
            message: "",
            redirectToSignin: false
        }
    }

    componentDidMount() {
        if (isAuthenticated()) {
            const userId = isAuthenticated().user._id
            const token = isAuthenticated().token
            getNotificationsByUser(userId, token).then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({
                        notifications: data.reverse()
                    });
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

    render() {
        const { redirectToSignin, user, notifications } = this.state
        if (redirectToSignin) return <Redirect to="/signin" />

        const photoUrl = user._id ?
            `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?
            ${new Date().getTime()}` :
            DefaultProfile

        const isActive = (history, path) => {
            if (window.location.pathname === path) return true
            else return false
        }

        return (
            <div className="section__dashboard">
                <div class="content">
                    <Sidebar />
                    <main class="main-content">
                        {
                            window.location.pathname === `/user/${isAuthenticated().user._id}/dashboard` ?
                                <div className="container">
                                    <h2>Notifications</h2>
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

                                </div> : ''
                        }

                    </main>
                </div>
            </div>








        );
    }

}

export default Dashboard;
