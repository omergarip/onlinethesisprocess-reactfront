import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isAuthenticated, signout } from '../auth';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';

const isActive = (history, path) => {
    if(history.location.pathname === path) return { color: "#ff9900" }
    else    return { color: "#ffffff" }
}


const Menu = ({ history }) => (
    <div>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="/">YSU</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <Link className="nav-link" style={ isActive(history, "/")} to="/">Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" style={ isActive(history, "/researches")} to="/researches">Research Topics</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" style={ isActive(history, "/faculty-members")} to="/faculty-members">Faculty Members</Link>
                </li>
            </ul>
            <ul className="navbar-nav ml-auto">
                { !isAuthenticated() && (
            <>
                <li className="nav-item">
                    <Link className="nav-link" style={ isActive(history, "/signin")} to="/signin">Sign In</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" style={ history.location.pathname === '/signup' || 
                                                        history.location.pathname === '/signup/faculty' ||
                                                        history.location.pathname === '/signup/student' ? 
                                                        {color: "#ff9900"} : { color: "#ffffff" } } to="/signup">Sign Up
                    </Link>
                </li>
            </>
        )}
        
        { isAuthenticated() && (
            <>
            
                <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle"  
                    style={ history.location.pathname === `/user/${isAuthenticated().user._id}` || 
                        history.location.pathname === `/user/${isAuthenticated().user._id}/request` ||
                        history.location.pathname === `/user/${isAuthenticated().user._id}/permission` ||
                        history.location.pathname === `/user/${isAuthenticated().user._id}/thesis-process` ||
                        history.location.pathname === `/user/${isAuthenticated().user._id}/thesis-form` ||
                        history.location.pathname === `/user/${isAuthenticated().user._id}` ? 
                        {color: "#ff9900"} : { color: "#ffffff" } } 
                        href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  { `${isAuthenticated().user.fname}'s profile` }
                </a>
               
                    {
                        isAuthenticated().user.userType === 'student' ?
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link to={`/user/${isAuthenticated().user._id}`} 
                                    className="dropdown-item">
                                    My Profile
                            </Link>
                            <Link to={`/user/${isAuthenticated().user._id}/thesis-process`} 
                                    className="dropdown-item">
                                    Thesis Process
                            </Link> 
                        </div> : 
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link to={`/user/${isAuthenticated().user._id}`} 
                                    className="dropdown-item">
                                    My Profile
                            </Link>
                            <Link to={`/user/${isAuthenticated().user._id}/permission`} 
                                    className="dropdown-item">
                                    Permission Requests
                            </Link>
                            <Link to={`/user/${isAuthenticated().user._id}/request`} 
                                    className="dropdown-item">
                                    Requests
                            </Link>
                        </div>
                    }
                    
                
              </li>
                
                <li className="nav-item">
                    <a 
                        className="nav-link" 
                        style={
                            ( isActive(history, "/signout"), 
                            { cursor: "pointer", color: "#fff" })
                        }
                        onClick={() => signout(() => history.push('/'))}>
                        Sign Out
                    </a>
                </li>
            </>
        )}
            </ul>
        </div>
    </nav>
        
    </div>
);

export default withRouter(Menu);
