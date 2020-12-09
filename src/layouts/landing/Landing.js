import React, { Component } from 'react'

class Landing extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Welcome to CryptoLyft!</h1>
            <p>Future that’s here right now!</p>
          </div>
        </div>
      </main>
    )
  }
}

export default Landing
