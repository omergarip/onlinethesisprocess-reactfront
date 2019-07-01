import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import Menu from './core/Menu';
import Signup from './user/Signup';
import FacultySignup from './user/FacultySignup';
import StudentSignup from './user/StudentSignup';
import Signin from './user/Signin';
import Profile from './user/Profile';
import PermissionProfile from './user/PermissionProfile';
import ProcessProfile from './user/ProcessProfile';
import RequestProfile from './user/RequestProfile';
import FacultyMembers from './user/FacultyMembers';
import EditProfile from './user/EditProfile';
import NewForm from './form/NewForm';
import NewResearch from './research/NewResearch';
import NewReview from './review/NewReview';
import Researches from './research/Researches';
import ShowResearch from './research/ShowResearch';
import PrivateRoute from './auth/PrivateRoute';

const MainRouter = () => (
    <div>
        <Menu/>
        <Switch>
            <Route exact path="/" component={ Home } />
            <Route exact path="/researches" component={ Researches } />
            <Route exact path="/faculty-members" component={ FacultyMembers } />
            <Route exact path="/signup" component={ Signup } />
            <Route exact path="/signup/student" component={ StudentSignup } />
            <Route exact path="/signup/faculty" component={ FacultySignup } />
            <Route exact path="/signin" component={ Signin } />
            <PrivateRoute exact path="/research/create" component={ NewResearch } />
            <PrivateRoute exact path="/research/:rId" component={ ShowResearch } />
            <PrivateRoute exact path="/user/:userId" component={ Profile } />
            <PrivateRoute exact path="/user/:userId/thesis-form" component={ NewForm } />
            <PrivateRoute exact path="/user/:userId/new-review" component={ NewReview } />
            <PrivateRoute exact path="/user/:userId/request" component={ RequestProfile } />
            <PrivateRoute exact path="/user/:userId/permission" component={ PermissionProfile } />
            <PrivateRoute exact path="/user/:userId/thesis-process" component={ ProcessProfile } />
            <PrivateRoute exact path="/user/edit/:userId" component={ EditProfile } />
        </Switch>
    </div>
)

export default MainRouter;