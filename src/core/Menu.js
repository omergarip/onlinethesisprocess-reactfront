import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isAuthenticated, signout } from '../auth';
import { getProcessByUserId } from '../process/apiProcess'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
// import $ from 'jquery';
// import Popper from 'popper.js';
import Logo from '../images/ylogo.png';
import DefaultProfile from '../images/avatar.png';

class Menu extends Component {
    constructor() {
        super();
        this.state = {
            processId: "",
            isNewProcess: false
        };
    }

    componentDidMount() {
        if (isAuthenticated())
        {
            const userId = isAuthenticated().user._id
            const token = isAuthenticated().token
            getProcessByUserId(userId, token).then(data => {
                if(data.error) {
                    console.log(data.error)
                } {
                    if (data.length === 0)
                        this.setState({ isNewProcess: true });
                    else {
                        this.setState({ 
                            processId: data[0]._id
                        });
                    }
                        
                }
            });
        }
    }


    render() {
        const { isNewProcess, processId } = this.state
        const isActive = (history, path) => {
            if(window.location.pathname === path) return { color: "#ff9900" }
            else    return { color: "#ffffff" }
        }
        
        const photoUrl = isAuthenticated() ? 
            `${process.env.REACT_APP_API_URL}/user/photo/${isAuthenticated().user._id}?
            ${new Date().getTime()}`: 
            DefaultProfile

        return (
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
                                    !isNewProcess ?
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
                                        <Link href="/" className="mainlink" onClick={() => signout('/')}>Sign Out</Link>
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
                <nav className="secondary_sticky">
                    <div className="row">
                        <img src={ Logo } alt="YSU Online Thesis Management System" className="secondary-logo-black"/>
                        <ul className="main-nav mr-auto js--main-nav">
                            <li>
                                <Link className="mainlink" to="/">Home</Link>
                            </li>
                            <li>
                                <Link className="mainlink" style={ isActive(window.location.pathname, "/researches")} to="/researches">Research Topics</Link>    
                            </li>
                            <li>
                                <Link className="mainlink" style={ isActive(window.location.pathname, "/faculty-members")} to="/faculty-members">Faculty Members</Link>  
                            </li>
                            { isAuthenticated() && (
                                <>
                                    <li>
                                        <Link className="mainlink" 
                                            style={ isActive(window.location.pathname, `/user/${isAuthenticated().user._id}/thesis-process`)}
                                            to={`/user/${isAuthenticated().user._id}/thesis-process`} >
                                                Thesis Process
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                        <ul className="main-nav main-nav-right js--main-nav">
                            { !isAuthenticated() ? (
                                <>
                                <li>
                                    <Link className="mainlink" style={ isActive(window.location.pathname, "/signin")} to="/signin">Sign In</Link>
                                </li>
                                <li>
                                    <Link className="mainlink" style={ window.location.pathname === '/signup' || 
                                                                        window.location.pathname === '/signup/faculty' ||
                                                                        window.location.pathname === '/signup/student' ? 
                                                                        {color: "#ff9900"} : { color: "#ffffff" } } to="/signup">Sign Up
                                    </Link>
                                </li>

                                </>
                            ) : 
                            <>
                                <li>
                                    <Link class="mainlink"  
                                        style={ window.location.pathname === `/user/${isAuthenticated().user._id}` || 
                                            window.location.pathname === `/user/${isAuthenticated().user._id}/request` ||
                                            window.location.pathname === `/user/${isAuthenticated().user._id}/permission` ||
                                            window.location.pathname === `/user/${isAuthenticated().user._id}/thesis-form` ||
                                            window.location.pathname === `/user/${isAuthenticated().user._id}` ? 
                                            {color: "#ff9900"} : { color: "#ffffff" } } 
                                            to={`/user/${isAuthenticated().user._id}`}>
                                        <img src={ photoUrl } alt={ `${isAuthenticated().user.fname}'s profile` } class="home-profile"/>
                                            My Profile
                                    </Link>
                                </li>
                                <li id="notification__icon">
                                    <Link className="notification">
                                        <i class="fas fa-bell"></i><span class="badge badge-danger">9</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        className="mainlink" 
                                        style={
                                            ( isActive(window.location.pathname, "/signout"), 
                                            { cursor: "pointer", color: "#fff" })
                                        }
                                        onClick={() => signout('/')}>
                                        Sign Out
                                    </Link>
                                </li>
                            </>
                            }
                            
                        </ul>
                        <a class="mobile-nav-icon js--nav-icon"><i class="icon ion-md-menu"></i></a>
                    </div>
                </nav>
            }
        </div>
        );
    }

}
 
export default withRouter(Menu);
