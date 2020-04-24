import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { getProcessByUserId } from './apiProcess';

class SelectAdviser extends Component {
    constructor() {
        super();
        this.state = {
            process: [],
            loading: false,
        };
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        getProcessByUserId(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    process: data[0],
                    loading: false
                });
                console.log(data[0].adviserId)
            }
        });
    }

    render() {
        const { process } = this.state;

        return (
            <>
                {process.topicId ?
                    <div class={
                        this.state.active ? 'accordion-item active' : 'accordion-item'

                    }>
                        <button className={process.adviserId !== undefined ? 'done title' : 'title'} onClick={() => this.setState({ active: !this.state.active })}>
                            Select Advisor {process.adviserId !== undefined ? <span class="checkmark">&#10003;</span> : ''}
                        </button>
                        <div className="panel">
                            {process.adviserId === undefined ?
                                <>
                                    <p className="lead process-text text-center">
                                        Now, You can select your advisor.
                                    </p>
                                    <p className="lead process-text text-center">
                                        Click button to find your advisor.
                                    </p>
                                    <div className="process__btn-center">
                                        <Link
                                            to={`/faculty-members`} className="btn-purple" id="process__btn"	>
                                            Select Advisor
                                    </Link>
                                    </div>
                                </>
                                : <div>
                                    <p className="lead process-text text-center">
                                        You have selected your advisor.
                                    </p>
                                    <div className="d-flex justify-content-center">
                                        <Link
                                            id="process__link"
                                            to={`/user/${process.adviserId._id}`}
                                        >
                                            {process.adviserId.fname} {process.adviserId.lname}
                                        </Link>
                                    </div>
                                </div>}
                        </div>
                    </div> : null
                }

            </>
        );
    }
};

export default SelectAdviser;