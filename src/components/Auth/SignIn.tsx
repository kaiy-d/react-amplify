import React from 'react'
import { SignIn as AmplifySignIn } from 'aws-amplify-react'
import { Hub, I18n } from '@aws-amplify/core'
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

export default class SignIn extends AmplifySignIn {
  constructor(props) {
    super(props)

    // This is needed to parse login attempts and to be able to display error message to the user
    Hub.listen('auth', this.onHubCapsule.bind(this))

    this.state = {
      loginErrorMessage: '',
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onHubCapsule({ channel, payload, source }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, event, message } = payload
    if (channel === 'auth' && event === 'signIn_failure') {
      this.setState({
        loginErrorMessage: data.message,
      })
    }
  }

  onSubmit(event) {
    if (!!this.getUsernameFromInput() === false) {
      this.setState({
        loginErrorMessage: 'Email cannot be empty',
      })
      return event.preventDefault()
    }

    this.signIn(event)
  }

  showComponent() {
    return (
      <Grid centered columns={1}>
        <Grid.Column mobile={16} tablet={10} computer={6}>
          <Segment>
            <Dimmer active={this.state.loading} inverted>
              <Loader inverted />
            </Dimmer>
            <Form
              onSubmit={this.onSubmit.bind(this)}
              warning={!!this.state.loginErrorMessage}
            >
              <Header>{I18n.get('Login to your account')}</Header>
              <Message warning>
                {I18n.get(this.state.loginErrorMessage)}
              </Message>
              <Form.Input
                label={I18n.get('Email *')}
                placeholder={I18n.get('Enter your email')}
                type='email'
                name='email'
                onChange={this.handleInputChange}
              />
              <Form.Input
                label={I18n.get('Password *')}
                placeholder={I18n.get('Enter your password')}
                type='password'
                name='password'
                onChange={this.handleInputChange}
              />
              <List>
                <List.Item
                  as='a'
                  onClick={() => this.changeState('forgotPassword')}
                >
                  {I18n.get('Reset password')}
                </List.Item>
              </List>
              <Grid columns={2}>
                <Grid.Column verticalAlign='bottom' textAlign='left'>
                  <List>
                    <List.Item
                      as='a'
                      onClick={() => this.changeState('signUp')}
                    >
                      {I18n.get('Create account')}
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column textAlign='right'>
                  <Form.Button type='submit'>{I18n.get('Sign In')}</Form.Button>
                </Grid.Column>
              </Grid>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}
