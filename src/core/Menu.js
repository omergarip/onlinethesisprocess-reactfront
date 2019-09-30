import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isAuthenticated, signout } from '../auth';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
// import $ from 'jquery';
// import Popper from 'popper.js';
import Logo from '../images/ylogo.png';
import DefaultProfile from '../images/avatar.png';


const isActive = (history, path) => {
    if(history.location.pathname === path) return { color: "#ff9900" }
    else    return { color: "#ffffff" }
}

const photoUrl = isAuthenticated() ? 
    `${process.env.REACT_APP_API_URL}/user/photo/${isAuthenticated().user._id}?
    ${new Date().getTime()}`: 
    DefaultProfile


const Menu = ({ history }) => (
    <div>
        {
            window.location.pathname === '/' ?
            <header id="home">
                <nav>
                    <div className="row">
                        <img src={ Logo } alt="YSU Online Thesis Management System" className="main-logo"/>
                        <img src={ Logo } alt="YSU Online Thesis Management System" className="main-logo-black"/>
                        <ul className="main-nav mr-auto js--main-nav">
                            <li><a className="mainlink" href="#home">Home</a></li>
                            <li><a className="mainlink" href="#research-topics">Research Topics</a></li>
                            <li><a className="mainlink" href="#faculty-members">Faculty Members</a></li>
                            { isAuthenticated() && (
                                <>
                                   <li>
                                       <Link className="mainlink" to={`/user/${isAuthenticated().user._id}/thesis-process`} >Thesis Process</Link>
                                   </li>
                                </>
                            )}
                        </ul>
                        <ul className="main-nav main-nav-right js--main-nav">
                            { !isAuthenticated() ? (
                                <>
                                    <li><a className="mainlink" href="/signin">Sign In</a></li>
                                    <li><a className="mainlink" href="/signup">Sign Up</a></li>

                                </>
                            ) : 
                            <>
                                <li>
                                    <Link to={`/user/${isAuthenticated().user._id}`} className="mainlink">
                                        <img src={ photoUrl } alt={ `${isAuthenticated().user.fname}'s profile` } class="home-profile"/>
                                            My Profile
                                    </Link>   
                                </li>
                                <li>
                                    <Link className="notification">
                                        <i class="fas fa-bell"></i><span class="badge badge-danger">9</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="mainlink" onClick={() => signout(() => history.push('/'))}>Sign Out</Link>
                                </li>
                            </>
                            }
                            
                        </ul>
                        <a class="mobile-nav-icon js--nav-icon"><i class="icon ion-md-menu"></i></a>
                    </div>
                </nav>
                <div class="text-box">
                    <h1 class="heading-primary">
                        <span class="heading-primary-main">Youngstown&nbsp;State&nbsp;University</span>
                        <blockquote class="blockquote">
                            <span class="heading-primary-sub">Web-based Thesis Workflow Management System   </span>
                        </blockquote>
                        <Link class="mainbtn mainbtn-full" to="/signup">Get Started</Link>
                        <a class="mainbtn mainbtn-ghost js--scroll-to-info" href="#">Learn More</a>
                    </h1>
                </div>
            </header>    
            : 
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="/">
                    <img src={ Logo }  height="30" class="d-inline-block align-top" alt=""/>
                </a>
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
                        {
                            isAuthenticated() && (
                                <>
                                <li className="nav-item">
                                        <Link className="nav-link" style={ isActive(history, `/user/${isAuthenticated().user._id}/thesis-process`)} to={`/user/${isAuthenticated().user._id}/thesis-process`} >Thesis Process</Link>
                                    </li>         
                                </>
                            )
                        }                               
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
                    
                        <li class="nav-item">
                            <Link class="nav-link"  
                                style={ history.location.pathname === `/user/${isAuthenticated().user._id}` || 
                                    history.location.pathname === `/user/${isAuthenticated().user._id}/request` ||
                                    history.location.pathname === `/user/${isAuthenticated().user._id}/permission` ||
                                    history.location.pathname === `/user/${isAuthenticated().user._id}/thesis-form` ||
                                    history.location.pathname === `/user/${isAuthenticated().user._id}` ? 
                                    {color: "#ff9900"} : { color: "#ffffff" } } 
                                    to={`/user/${isAuthenticated().user._id}`}>
                                <img src={ photoUrl } alt={ `${isAuthenticated().user.fname}'s profile` } class="home-profile"/>
                                    My Profile
                            </Link>
                        </li>
                        <li className="nav-item" id="notification__icon">
                            <Link className="notification">
                                <i class="fas fa-bell"></i><span class="badge badge-danger">9</span>
                            </Link>
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
        }
    </div>
            
    
    
        
);

export default withRouter(Menu);
