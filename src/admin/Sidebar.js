import React, { Component } from 'react';
import { isAuthenticated, signout } from '../auth';
import { Link } from "react-router-dom";
import Logo from '../images/ylogo.png';

class Sidebar extends Component {
    render() {
        const isActive = (history, path) => {
            if (window.location.pathname === path) return true
            else return false
        }


        return (
            <div className="dashboard__sidebar">
                <div className="menu">
                    <ul>
                        <a href="#"><img src={Logo} alt="YSU Online Thesis Management System" className="menu-logo" /></a>
                        <li className={isActive(window.location.pathname, `/user/${isAuthenticated().user._id}/dashboard`) ? 'active' : null}>
                            <Link to={`/user/${isAuthenticated().user._id}/dashboard/notifications`}>
                                <i className="fa fa-bell"></i><span>Notifications</span>
                            </Link>
                        </li>
                        <li className={isActive(window.location.pathname, `/user/${isAuthenticated().user._id}/dashboard/users`) ? 'active' : null}>
                            <Link to={`/user/${isAuthenticated().user._id}/dashboard/users`}>
                                <i class="fas fa-user"></i><span>Users</span>
                            </Link>
                        </li>
                        <li className={isActive(window.location.pathname, `/user/${isAuthenticated().user._id}/dashboard/presentation-place`) ? 'active' : null}>
                            <Link to={`/user/${isAuthenticated().user._id}/dashboard/presentation-place`}>
                                <i class="fas fa-location-arrow"></i><span>Presentation</span>
                            </Link>
                        </li>
                        <li className={isActive(window.location.pathname, `/user/${isAuthenticated().user._id}/dashboard/thesis-approval`) ? 'active' : null}>
                            <Link to={`/user/${isAuthenticated().user._id}/dashboard/thesis-approval`}>
                                <i className="fa fa-bell"></i><span>Notifications</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" onClick={() => {
                                if (typeof window !== 'undefined') window.localStorage.removeItem('jwt');
                                signout()
                            }}><i className="fas fa-sign-out-alt"></i><span>Sign Out</span></Link>
                        </li>
                    </ul>
                </div>
            </div>

        );
    }

}

export default Sidebar;
