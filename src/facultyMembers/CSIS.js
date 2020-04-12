import React, { Component } from 'react';
import { listFaculty } from '../user/apiUser';
import '../css/faculty.css';
import ListMembers from './ListMembers';

class CSIS extends Component {
	constructor() {
		super();
		this.state = {
			users: []
		};
	}

	componentDidMount() {
        listFaculty()
        .then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
                var dep = data.reduce((dep, thing) => {
                    if (thing.department === 'Computer Science & Information Systems') {
                        dep.push(thing);
                    }
                    return dep;
                  }, []);
				this.setState({ users: dep.slice(-4) });
			}
		});
	}

	render() {
		const { users } = this.state;

		return (			
			<>
				<ListMembers users = {users}/>
			</>
		);
	}
}

export default CSIS;