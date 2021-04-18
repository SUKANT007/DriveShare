import React, { Component } from 'react';

class Landing extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<main className="container bg1">
				<div className="landing__container">
					<div className="pure-u-1-1" style={ { textAlign: 'center' } }>
						<h1 className='textHead'>Welcome to CryptoPool!</h1>
						<p className='textSubHead' style={ { color: 'white' } }>Future that’s here right now!</p>
					</div>
				</div>
			</main>
		);
	}
}

export default Landing;
