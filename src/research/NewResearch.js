import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create } from "./apiResearch";
import { Redirect } from "react-router-dom";

class NewResearch extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            description: '',
            body: '',
            error: '',
            user: {},
            loading: false,
            redirectToProfile: false
        };
    }

    componentDidMount() {
        this.setState({ user: isAuthenticated().user })
    }

    isValid = () => {
        const { title, body, description } = this.state;
        if (title.length === 0 || body.length === 0 || description.length === 0) {
            this.setState({ error: "All fields are required", loading: false });
            return false;
        }
        return true;
    };

    handleChange = (name) => event => {
        this.setState({ error: "" });
        this.setState({
            [name]: event.target.value
        });
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const { title, description, body } = this.state;
            const research = {
                title, description, body
            };
            create(userId, token, research).then(data => {
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    this.setState({
                        loading: false,
                        title: '',
                        description: '',
                        body: '',
                        redirectToProfile: true
                    })
                }
            });
        }
    };

    newResearchForm = (title, description, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input
                    onChange={this.handleChange("title")}
                    type="text"
                    className="form-control"
                    value={title}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Small Description</label>
                <textarea
                    onChange={this.handleChange("description")}
                    type="text"
                    className="form-control"
                    value={description}
                />
                <small className="form-text text-muted">
                    This information will be displayed by all users.
                </small>
            </div>
            <div className="form-group">
                <label className="text-muted">Whole Description</label>
                <textarea
                    onChange={this.handleChange("body")}
                    type="text"
                    className="form-control"
                    value={body}
                />
                <small className="form-text text-muted">
                    This information will be displayed by only authenticated users.
                </small>
            </div>
            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary"
            >
                Create Research Topic
            </button>
        </form>
    );

    render() {
        const {
            title,
            description,
            body,
            user,
            redirectToProfile,
            error,
            loading,
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />;
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Create Research Topic</h2>
                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                        ""
                    )}

                {this.newResearchForm(title, description, body)}
            </div>
        );
    }
}

export default NewResearch;