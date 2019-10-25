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
import FacultyMembers from './user/FacultyMembers';
import EditProfile from './user/EditProfile';
import NewForm from './form/NewForm';
import NewResearch from './research/NewResearch';
import Researches from './research/Researches';
import ShowResearch from './research/ShowResearch';
import NewProcess from './process/NewProcess';
import Processes from './process/Processes';
import NewIntroduction from './thesis/NewIntroduction';
import Introduction from './thesis/Introduction';
import LiteratureReview from './thesis/LiteratureReview';
import NewLiteratureReview from './thesis/NewLiteratureReview';
import Methodology from './thesis/Methodology';
import NewMethodology from './thesis/NewMethodology';
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
            <PrivateRoute exact path="/thesis-process/:pId/form" component={ NewForm } />
            <PrivateRoute exact path="/thesis-process/:pId/introduction" component={ NewIntroduction } />
            <PrivateRoute exact path="/thesis-process/:pId/introduction/:introId" component={ Introduction } />
            <PrivateRoute exact path="/thesis-process/:pId/literature-review" component={ NewLiteratureReview } />
            <PrivateRoute exact path="/thesis-process/:pId/literature-review/:reviewId" component={ LiteratureReview } />
            <PrivateRoute exact path="/thesis-process/:pId/methodology" component={ NewMethodology } />
            <PrivateRoute exact path="/thesis-process/:pId/methodology/:metId" component={ Methodology } />
            <PrivateRoute exact path="/user/:userId/request" component={ RequestProfile } />
            <PrivateRoute exact path="/user/:userId/permission" component={ PermissionProfile } />
            <PrivateRoute exact path="/thesis-process" component={ NewProcess } />
            <PrivateRoute exact path="/thesis-process/:pId" component={ Processes } />
            <PrivateRoute exact path="/user/edit/:userId" component={ EditProfile } />
        </Switch>
        <Footer/>
    </div>
)

export default MainRouter;