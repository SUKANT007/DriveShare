import React, { Component } from 'react';
import SignUpFormContainer from '../../ui/signupform/SignUpFormContainer';

class SignUp extends Component {
	render() {
		return (
			<main className="container">
				<div className="pure-g card">
					<div className="pure-u-1-1" style={ { padding: '2rem' } }>
						<h1>Sign Up</h1>
						<p>We've got your wallet information, simply input your name and your account is made!</p>
						<SignUpFormContainer />
					</div>
				</div>
			</main>
		);
	}
}

export default SignUp;
