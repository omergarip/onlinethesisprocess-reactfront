import React, { Component, Profiler } from "react";
import { isAuthenticated } from "../auth";
import { read, update, updateUser } from "./apiUser";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../images/avatar.png";
import Loading from '../core/Loading'

class EditProfile extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            fname: "",
            lname: "",
            email: "",
            password: "",
            bannerId: '',
            department: '',
            redirectToProfile: false,
            error: "",
            fileSize: 0,
            loading: false,
            areas: ""
        };
    }

    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token).then(data => {
            if (data.error) {
                this.setState({ redirectToProfile: true });
            } else {
                this.setState({
                    id: data._id,
                    fname: data.fname,
                    lname: data.lname,
                    email: data.email,
                    error: "",
                    areas: data.areas,
                    bannerId: data.bannerId,
                    department: data.department
                });
            }
        });
    };

    componentDidMount() {
        this.userData = new FormData();
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    isValid = () => {
        const { fname, lname, email, password, fileSize } = this.state;
        if (fileSize > 1000000) {
            this.setState({
                error: "File size should be less than 1mb",
                loading: false
            });
            return false;
        }
        if (fname.length === 0 && lname.length === 0) {
            this.setState({ error: "Name is required", loading: false });
            return false;
        }
        // email@domain.com
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            this.setState({
                error: "A valid Email is required",
                loading: false
            });
            return false;
        }
        if (password.length >= 1 && password.length <= 5) {
            this.setState({
                error: "Password must be at least 6 characters long",
                loading: false
            });
            return false;
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({ error: "" });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;

        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.userData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;

            update(userId, token, this.userData).then(data => {
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    updateUser(data, () => {
                        this.setState({
                            redirectToProfile: true
                        });
                    });
                }
            });
        }
    };

    signupForm = (fname, lname, email, password, areas) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Profile Photo</label>
                <input
                    onChange={this.handleChange("photo")}
                    type="file"
                    accept="image/*"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">First Name</label>
                <input
                    onChange={this.handleChange("fname")}
                    type="text"
                    className="form-control"
                    value={fname}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Last Name</label>
                <input
                    onChange={this.handleChange("lname")}
                    type="text"
                    className="form-control"
                    value={lname}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={this.handleChange("email")}
                    type="email"
                    className="form-control"
                    value={email}
                />
            </div>
            {
                isAuthenticated().user.userType === 'faculty' ?

                    <div className="form-group">
                        <label className="text-muted">Area of Research Interest</label>
                        <textarea
                            onChange={this.handleChange("areas")}
                            type="text"
                            className="form-control"
                            value={areas}
                        />
                    </div> : ''
            }
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    onChange={this.handleChange("password")}
                    type="password"
                    className="form-control"
                    value={password}
                />
            </div>
            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary"
            >
                Update
            </button>
        </form>
    );

    render() {
        const {
            id,
            fname,
            lname,
            email,
            password,
            redirectToProfile,
            error,
            loading,
            areas
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />;
        }

        const photoUrl = id
            ? `https://onlinethesisprocess-omergarip.c9users.io/user/photo/${id}?${new Date().getTime()}`
            : DefaultProfile;

        return (
            <section className="section__edit-profile">
                <div className="container">
                    <h2 className="mt-5 mb-5">Edit Profile</h2>
                    <div
                        className="alert alert-danger"
                        style={{ display: error ? "" : "none" }}
                    >
                        {error}
                    </div>

                    {loading ? (
                        <Loading />
                    ) : (
                            ""
                        )}
                    <div className="profile-edit">
                        <img
                            className="img-thumbnail profile-edit__photo"
                            src={photoUrl}
                            onError={i => (i.target.src = `${DefaultProfile}`)}
                            alt={fname}
                        />


                        {isAuthenticated().user._id === id &&
                            this.signupForm(fname, lname, email, password, areas)}

                    </div>
                </div>
            </section>

        );
    }
}

export default EditProfile;