import React, { Component } from 'react';
import RideList from './RideList';

class Dashboard extends Component {
	constructor(props, { authData }) {
		super(props);
		authData = this.props;
	}

	render() {
		return (
			<main className="dashboard bg3">
				<div className='dashboard__content'>
					<h1>Dashboard</h1>
					<RideList />
				</div>
			</main>
		);
	}
}

export default Dashboard;
