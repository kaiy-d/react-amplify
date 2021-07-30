import React from 'react'
import { render } from 'react-dom'
import App from './App'
import Authenticator from './containers/Authenticator'
import SignIn from './components/Auth/SignIn'
import SignUp from './components/Auth/SignUp'
import ConfirmSignUp from './components/Auth/ConfirmSignUp'
import ForgotPassword from './components/Auth/ForgotPassword'
import ConfirmForgotPassword from './components/Auth/ConfirmForgotPassword'
import awsconfig from './aws-exports'
import signUpConfig from './config/signup'

import 'semantic-ui-css/semantic.min.css'

render(
  <Authenticator
    hideDefault={true}
    amplifyConfig={awsconfig}
    usernameAttributes='email'
  >
    <SignIn override={'SignIn'} />
    <SignUp override={'SignUp'} signUpConfig={signUpConfig} />
    <ConfirmSignUp override={'ConfirmSignUp'} />
    <ForgotPassword override={'ForgotPassword'} />
    <ConfirmForgotPassword override={'ForgotPassword'} />
    <App />
  </Authenticator>,
  document.getElementById('app'),
)
