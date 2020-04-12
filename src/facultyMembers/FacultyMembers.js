import React, { Component } from 'react';
import { listFaculty } from '../user/apiUser';
import DefaultProfile from '../images/avatar.png';
import { Link } from 'react-router-dom';
import BSD from './BSD';
import CD from './CD';
import CECED from './CECED';
import CED from './CED';
import CSIS from './CSIS';
import ECED from './ECED';
import EMD from './EMD';
import ETD from './ETD';
import GESD from './GESD';
import MIMED from './MIMED';
import MSD from './MSD';
import MSED from './MSED';
import PAD from './PAD';
import BaccMed from './BaccMed';

class FacultyMembers extends Component {
	constructor() {
		super();
		this.state = {
			users: []
		};
	}

	render() {
		const { users } = this.state;

		return (
			<section className="section__faculty-members">
				<div className="container">
					<div className="col-md-12 text-center">
						<h2>Faculty Members</h2>
					</div>
					<BSD />
					<CED />
					<CD />
					<CECED />
					<CSIS />
					<ECED />
					<EMD />
					<ETD />
					<GESD />
					<MSD />
					<MSED />
					<MIMED />
					<PAD />
					<BaccMed />

				</div>
			</section>
		);
	}
}

export default FacultyMembers;