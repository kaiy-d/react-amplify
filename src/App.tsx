import React from 'react'
import { AuthPiece } from 'aws-amplify-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import Navigation from './components/Navigation'
import CardScanDashboard from './components/CardScanDashboard'
import './App.css'

class App extends AuthPiece<{}, {}> {
  constructor(props) {
    super(props)
    // this lists the states that the component will render showComponent
    this._validAuthStates = ['signedIn']
  }

  showComponent() {
    return (
      <div>
        <Navigation authData={this.props.authData} />
        <CardScanDashboard authData={this.props.autData} />
        <ToastContainer />
      </div>
    )
  }
}

export default App
