import React, { Component } from 'react';
import RideshareContract from '../../../build/contracts/Rideshare.json';
import store from '../../store';
import JoinRideContainer from '../../rideshare/ui/joinride/JoinRideContainer';
import { Link } from 'react-router';
import { connect } from 'react-redux';


const contract = require('truffle-contract');

class RideList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rideshares: [],
			passengers: [],
			driver: '',
			rideshareLoading: true
		};
		this.getRides = this.getRides.bind(this);
		this.rideshareButton = this.rideshareButton.bind(this);
	}

	componentDidMount() {
		this.getRides();
		console.log(this.props.user);
		console.log(this.state.rideshares);
	}

	getRides() {
		let web3 = store.getState().web3.web3Instance;

		const rideshare = contract(RideshareContract);
		rideshare.setProvider(web3.currentProvider);

		// Declaring this for later so we can chain functions on Authentication.
		var rideshareInstance;

		var _this = this;

		// Get current ethereum wallet.
		web3.eth.getCoinbase((error, coinbase) => {
			// Log errors, if any.
			if (error) {
				console.error(error);
			}

			rideshare.deployed().then(function (instance) {
				rideshareInstance = instance;

				rideshareInstance.getRideCount.call()
					.then(function (result) {
						console.log('get rideshare count');
						console.log(result);
						let rideshareCount = result["c"][0];

						for (let i = 0; i < rideshareCount; i++) {
							rideshareInstance.getRide.call(i)
								.then(function (result) {
									// If no error, login user.
									console.log('getridesharecount');
									console.log(result);
									var tempArr = _this.state.rideshares;
									let tempRideshares = tempArr.concat([result]);
									_this.setState({ rideshares: tempRideshares });
									console.log('test2');
									console.log(_this.state.rideshares);
									// debugger
									// return result;
									// return dispatch(loginUser())
								});
							rideshareInstance.getPassengers.call(i)
								.then(function (result) {
									var tempArr = _this.state.passengers;
									let tempPassengers = tempArr.concat([result]);
									_this.setState({ passengers: tempPassengers });
								})
								// Attempt to sign up user.
								.catch(function (result) {
									// If error...
								});
						}
						_this.setState({ rideshareLoading: false });
					});
			});
		});
	}

	rideshareButton(condition, bigNum, i) {
		let web3 = store.getState().web3.web3Instance;
		console.log('passengers');
		// console.log(this.state.passengers);
		// console.log(this.state.rideshares);
		const driver = this.state.rideshares[0][0];

		if (web3.eth.accounts[0] == driver) {
			return (
				<b>You are a driver</b>
			);
		}

		if (condition) {
			return (
				<span>Leave</span>
			);
		} else {
			return (
				<JoinRideContainer ride_number={ i } payment={ web3.fromWei(bigNum, "ether").toNumber() } />
			);
		}
	}

	render() {
		let web3 = store.getState().web3.web3Instance;

		if (this.state.rideshareLoading) {
			return (
				<p>Loading</p>
			);
		} else {
			return (
				<div className="pure-g" style={ { marginBottom: '1rem' } }>
					<div className="pure-u-1-1">
						{ this.state.rideshares.map((ride, i) => {
							console.log(ride);
							return (
								<div className='card' style={ { marginBottom: '1rem' } }>
									<div className='ride__entry'>
										<div>
											<div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>

												<h2 style={ { marginTop: 0 } }>	{ ride[3] } > { ride[4] }</h2>
												{/* <h3 style={ { marginTop: 0 } }>{ ride[1].e }</h3> */ }
											</div>
											<div><b>Driver's Address: </b>{ ride[0] }</div>
										</div>
										<div>
											<h3 style={ { marginTop: 0, padding: '0 1rem ' } }>{ web3.fromWei(ride[1], "ether").toNumber() } ETH</h3>
										</div>
										{/* <div><b>Seats Available: </b>{ ride[2]["c"][0] }</div> */ }
										<div>
											{ this.rideshareButton(this.state.passengers[i].indexOf(web3.eth.accounts[0]) > -1, ride[1], i) }
										</div>
										<span style={ { margin: '0 1rem' } }>

											<Link to={ `/details/${i}` }>Details</Link>
										</span>
									</div>
								</div>
							);
						}) }
					</div>
				</div >
			);
		}
	}
}

const mapStateToProps = (state) => ({
	user: state.user.data
});


export default connect(mapStateToProps)(RideList);
