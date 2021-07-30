import React from 'react'
import { ConfirmSignUp as AmplifyConfirmSignUp } from 'aws-amplify-react'
import { Hub, I18n } from '@aws-amplify/core'
import Auth from '@aws-amplify/auth'
import {
  Grid,
  List,
  Header,
  Form,
  Segment,
  Dimmer,
  Loader,
  Message,
} from 'semantic-ui-react'

export default class ConfirmSignUp extends AmplifyConfirmSignUp {
  constructor(props) {
    super(props)

    // This is needed to parse confirm signup attempts and to be able to display error message to the user
    Hub.listen('confirmSignUp', this.onHubCapsule.bind(this))

    this.state = {
      formErrorMessage: '',
      loading: false,
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onHubCapsule({ channel, payload, source }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, type } = payload
    if (channel === 'confirmSignUp' && type === 'error') {
      this.setState({
        formErrorMessage: data,
        loading: false,
      })
    }
  }

  onSubmit(event) {
    this.setState({
      loading: true,
    })

    this.confirm(event)
  }

  onResend(event) {
    event.preventDefault()

    this.setState({
      loading: true,
    })

    const username = this.usernameFromAuthData() || this.inputs.username

    Auth.resendSignUp(username)
      .then(() =>
        this.setState({
          loading: false,
        }),
      )
      .catch(error => {
        if (typeof error !== 'string') {
          error = error.message ? error.message : JSON.stringify(error)
        }

        this.setState({
          formErrorMessage: error,
          loading: false,
        })
      })
  }

  showComponent() {
    const username = this.usernameFromAuthData()

    return (
      <Grid centered columns={1}>
        <Grid.Column mobile={16} tablet={10} computer={6}>
          <Segment>
            <Dimmer active={this.state.loading} inverted>
              <Loader inverted />
            </Dimmer>
            <Form
              onSubmit={this.onSubmit.bind(this)}
              warning={!!this.state.formErrorMessage}
            >
              <Header>{I18n.get('Confirm Signup')}</Header>
              <Message warning>{I18n.get(this.state.formErrorMessage)}</Message>
              <Form.Input
                label={I18n.get('Username *')}
                disabled={!!username}
                type='email'
                name='username'
                value={username ? username : ''}
                onChange={this.handleInputChange}
              />
              <Form.Input
                label={I18n.get('Confirmation code *')}
                placeholder={I18n.get('Enter your code')}
                type='text'
                name='code'
                onChange={this.handleInputChange}
              />
              <List>
                <List.Item as='a' onClick={this.onResend.bind(this)}>
                  {I18n.get('Resend Code')}
                </List.Item>
              </List>
              <Grid columns={2}>
                <Grid.Column verticalAlign='bottom' textAlign='left'>
                  <List>
                    <List.Item
                      as='a'
                      onClick={() => this.changeState('signIn')}
                    >
                      {I18n.get('Back to Sign in')}
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column textAlign='right'>
                  <Form.Button type='submit'>{I18n.get('Confirm')}</Form.Button>
                </Grid.Column>
              </Grid>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}
