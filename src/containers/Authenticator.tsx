import { Authenticator as AmplifyAuthenticator } from 'aws-amplify-react'
import { Hub } from '@aws-amplify/core'

export default class Authenticator extends AmplifyAuthenticator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleAuthEvent(state, event, showToast = true) {
    Hub.dispatch(state, event)
  }
}
