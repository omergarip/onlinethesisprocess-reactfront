import React, { Component } from 'react';
import 'flatpickr/dist/themes/material_green.css'
import Flatpickr from 'react-flatpickr'
import { isAuthenticated } from '../auth';
import { getProcessByUserId, updateForm } from '../process/apiProcess';
import { create, getForm } from "./apiForm";
import Logo from '../images/ylogo.png'

class Form extends Component {
    constructor() {
        super()
        this.state = {
            formId: '',
            pId: '',
            adviserId: '',
            adviserName: "",
            address: "",
            proposedTitle: "",
            city: '',
            zipcode: '',
            state: '',
            form: '',
            date: "",
            updateFId: false,
            redirectToProfile: false
        }
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        getProcessByUserId(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                if (data.length === 0)
                    console.log(data.error)
                else {
                    this.setState({
                        pId: data[0]._id,
                        adviserId: data[0].adviserId._id,
                        adviserName: `${data[0].adviserId.fname} ${data[0].adviserId.lname}`,
                        loading: false
                    });

                }
            }
        });
        const studentId = isAuthenticated().user._id
        getForm(studentId, token).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    loading: false,
                    form: data[0]
                });
            }
        });
    }

    isValid = () => {
        const { proposedTitle, date, address } = this.state;
        if (proposedTitle.length === 0 || date.length === 0 || address.length === 0) {
            this.setState({ error: "All fields are required" });
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
        if (this.isValid()) {
            const studentId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const { pId, adviserId, proposedTitle, address, date, zipcode, city, state } = this.state
            const form = {
                studentId, adviserId, address, proposedTitle, date, zipcode, city, state
            }
            create(pId, token, form).then(data => {
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    getForm(studentId, token).then(data => {
                        if (data.error) {
                            this.setState({ error: data.error });
                        } else {
                            const formId = data[0]._id
                            updateForm(pId, formId, token).then(data => {
                                if (data.error) {
                                    this.setState({ error: data.error });
                                } else {
                                    this.setState({
                                        loading: false,
                                        redirectToProfile: true
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    };

    redirectToTarget = (pId) => {
        this.props.history.push(`/thesis-process/${pId}`)
    }

    render() {
        const { redirectToProfile, pId, adviserName, form } = this.state
        if (redirectToProfile)
            this.redirectToTarget(pId)



        return (
            <section className="section__form">
                <div class="container main-secction" >
                    <div className="d-flex flex-row justify-content-center">
                        <img
                            style={{ height: "200px", width: "auto" }}
                            className="img-fluid" src={Logo} />
                    </div>
                    <h3 className="text-center"><strong>SUPERVISOR APPOINTMENT FORM</strong></h3>
                    <form>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="text-muted">Banner ID</label>
                                    <input
                                        value={isAuthenticated().user.bannerId}
                                        type="text"
                                        className="form-control"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className=" col-md-5 ">
                                <div className="form-group">
                                    <label className="text-muted">Student Name</label>
                                    <input
                                        value={`${isAuthenticated().user.fname} ${isAuthenticated().user.lname}`}
                                        type="text"
                                        className="form-control"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className=" col-md-4 ">
                                <div className="form-group">
                                    <label className="text-muted">Adviser Name</label>
                                    <input
                                        value={adviserName}
                                        type="text"
                                        className="form-control"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-12">
                                <label className="text-muted">Address</label>
                                <input
                                    onChange={this.handleChange("address")}
                                    type="text"
                                    className="form-control"
                                    value={form.address}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label className="text-muted">City</label>
                                <input
                                    onChange={this.handleChange("city")}
                                    type="text"
                                    className="form-control"
                                    value={form.city}
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <label className="text-muted">State</label>
                                <input
                                    onChange={this.handleChange("state")}
                                    type="text"
                                    className="form-control"
                                    value={form.state}
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <label className="text-muted">Zip Code</label>
                                <input
                                    onChange={this.handleChange("zipcode")}
                                    type="text"
                                    className="form-control"
                                    value={form.zipcode}
                                />
                            </div>
                            <div className="form-group col-md-8">
                                <label className="text-muted">Proposed title of thesis/dissertation/portfolio</label>
                                <input
                                    onChange={this.handleChange("proposedTitle")}
                                    type="text"
                                    className="form-control"
                                    value={form.proposedTitle}
                                />
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="text-muted">Anticipated Completion Date</label>
                                    <Flatpickr data-enable-time
                                        options={{ minDate: 'today' }}
                                        onChange={date => { this.setState({ date }) }}
                                        value={form.date}
                                    />
                                </div>
                            </div>


                        </div>
                    </form>
                </div>
            </section>

        );
    }
}

export default Form