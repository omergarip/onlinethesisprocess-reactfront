import React, { Component } from 'react';
import { listFaculty } from '../user/apiUser';
import ListMembers from './ListMembers';
import '../css/faculty.css';

class BSD extends Component {
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
                    if (thing.department === 'Biological Sciences Dept') {
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

export default BSD;