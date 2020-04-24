import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import Menu from './core/Menu';
import Footer from './core/Footer';
import Signup from './user/Signup';
import FacultySignup from './user/FacultySignup';
import StudentSignup from './user/StudentSignup';
import Signin from './user/Signin';
import Profile from './user/Profile';
import PermissionProfile from './user/PermissionProfile';
import RequestProfile from './user/RequestProfile';
import ThesisApproval from './user/ThesisApproval';
import FacultyMembers from './facultyMembers/FacultyMembers';
import EditProfile from './user/EditProfile';
import NewForm from './form/NewForm';
import Form from './form/Form';
import NewResearch from './research/NewResearch';
import Researches from './research/Researches';
import ShowResearch from './research/ShowResearch';
import NewProcess from './process/NewProcess';
import Processes from './process/Processes';
import Chapters from './thesis/Chapters';
import NewChapter from './thesis/NewChapter';
import Chapter from './thesis/Chapter';
import Committee from './committee/Committee';
import CommitteeMember from './committee/CommitteeMember';
import PrivateRoute from './auth/PrivateRoute';
import CheckRevision from './thesis/CheckRevision';
import ChapterApproval from './user/ChapterApproval';
import Dashboard from './admin/Dashboard'
import AdminUsers from './admin/AdminUsers'
import PresentationPlace from './admin/PresentationPlace'



const MainRouter = () => (
    <div>
        <Menu />
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/researches" component={Researches} />
            <Route exact path="/faculty-members" component={FacultyMembers} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/signup/student" component={StudentSignup} />
            <Route exact path="/signup/faculty" component={FacultySignup} />
            <Route exact path="/signin" component={Signin} />
            <PrivateRoute exact path="/research/create" component={NewResearch} />
            <PrivateRoute exact path="/research/:rId" component={ShowResearch} />
            <PrivateRoute exact path="/thesis-process/:pId/form" component={NewForm} />
            <PrivateRoute exact path="/thesis-process/:pId/form/:formId" component={Form} />
            <PrivateRoute exact path="/thesis-process/:pId/thesis/:thesisId/chapters" component={Chapters} />
            <PrivateRoute exact path="/thesis-process/:pId/thesis/:thesisId/chapter/new" component={NewChapter} />
            <PrivateRoute exact path="/thesis-process/:pId/thesis/:thesisId/chapter/:chapterId" component={Chapter} />
            <PrivateRoute exact path="/thesis-process/:pId/thesis/:thesisId/chapter/:chapterId/revision" component={CheckRevision} />
            <PrivateRoute exact path="/user/:userId" component={Profile} />
            <PrivateRoute exact path="/user/:userId/request" component={RequestProfile} />
            <PrivateRoute exact path="/user/:userId/permission" component={PermissionProfile} />
            <PrivateRoute exact path="/user/:userId/chapter-approval" component={ChapterApproval} />
            <PrivateRoute exact path="/user/:userId/thesis-approval" component={ThesisApproval} />
            <PrivateRoute exact path="/user/:userId/faculty/committee-member" component={CommitteeMember} />
            <PrivateRoute exact path="/thesis-process" component={NewProcess} />
            <PrivateRoute exact path="/thesis-process/:pId" component={Processes} />
            <PrivateRoute exact path="/thesis-process/:pId/committee-members" component={Committee} />
            <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
            <PrivateRoute exact path="/user/:userId/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/user/:userId/dashboard/users" component={AdminUsers} />
            <PrivateRoute exact path="/user/:userId/dashboard/presentation-place" component={PresentationPlace} />
        </Switch>
        <Footer />
    </div>
)

export default MainRouter;