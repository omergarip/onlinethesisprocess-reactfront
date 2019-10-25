import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { getProcess } from './apiProcess';

class SelectAdviser extends Component {
	constructor() {
		super();
		this.state = {
			process: [],
			loading: false,
		};
	}

	componentDidMount() {
		const pId = this.props.pId;
		const token = isAuthenticated().token;
		getProcess(pId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
                this.setState({ 
                    process : data[0],
                    loading: false
                });	
			}
		});
	}

	render() {
		const { process } = this.state;

		return (
            <>
                {  process.topicId !== undefined ? (	
                    <div>	
                        <div class="panel-heading mt-4" role="tab" id="headingOne">
                            <h4 class="panel-title">
                                <a className={ process.adviserId !== undefined  ? "collapsed status" : "collapsed"} role="button" data-toggle="collapse" 
                                data-parent="#accordion" href="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                    Select Adviser { process.adviserId !== undefined  ? <span class="checkmark">&#10003;</span> : ''}
                                </a>
                            </h4>
                        </div>
                        <div id="collapseTwo" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                            <div class="panel-body">
                                {
                                    process.adviserId === undefined ? 
                                    <div>
                                        <p className="lead process-text text-center">
                                            Now, You can select your adviser.
                                        </p>
                                        <p className="lead process-text text-center">
                                            Click button to find your adviser.
                                        </p>
                                        <div className="process__btn-center">
                                            <Link
                                                to={`/faculty-members`}
                                                className="btn-purple" id="process__btn">
                                                    Select Adviser.
                                            </Link>
                                        </div>
                                    </div> : 
                                    <div>
                                        <p className="lead process-text text-center">
                                            You have selected your adviser.
                                        </p>
                                        <div className="d-flex justify-content-center">
                                            <Link
                                                id="process__link"
                                                to={`/user/${process.adviserId._id}`}
                                            >
                                                    {process.adviserId.fname} {process.adviserId.lname}
                                            </Link>
                                        </div>
                                    </div>
                                } 		
                            </div>
                        </div>
                    </div>
                ): ''
            } 
			</>
		);
    }
};

export default SelectAdviser;