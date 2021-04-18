import React, { Component } from 'react';
import { Link } from 'react-router';
import CreateRideContainer from '../../rideshare/ui/createride/CreateRideContainer';

class Driver extends Component {
	render() {
		return (
			<main className="container bg2">
				<div className="pure-g card">
					<div className="pure-u-1-1">
						<h1>Drive Details</h1>
						<CreateRideContainer />
					</div>
				</div>
			</main>
		);
	}
}

export default Driver;
