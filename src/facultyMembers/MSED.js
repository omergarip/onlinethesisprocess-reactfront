import React, { Component } from 'react';
import { listFaculty } from '../user/apiUser';
import ListMembers from './ListMembers';
import '../css/faculty.css';

class MSED extends Component {
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
                    if (thing.department === 'Material Science & Engineering') {
                        dep.push(thing);
                    }
                    return dep;
                  }, []);
				this.setState({ users: dep });
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

export default MSED;