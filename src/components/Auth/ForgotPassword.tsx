import React from 'react'
import { ForgotPassword as AmplifyForgotPassword } from 'aws-amplify-react'
import Auth from '@aws-amplify/auth'
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

export default class ForgotPassword extends AmplifyForgotPassword {
  constructor(props) {
    super(props)

    // This is needed to parse confirm signup attempts and to be able to display error message to the user
    Hub.listen('forgotPassword', this.onHubCapsule.bind(this))
    this.state = {
      formErrorMessage: '',
      loading: false,
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onHubCapsule({ channel, payload, source }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, type } = payload
    if (channel === 'forgotPassword' && type === 'error') {
      this.setState({
        formErrorMessage: data,
        loading: false,
      })
    }
  }

  onSubmit() {
    this.setState({
      loading: true,
    })

    const username = this.getUsernameFromInput()

    Auth.forgotPassword(username)
      .then(() => {
        this.setState({
          loading: false,
        })
        this.changeState('confirmForgotPassword', { username: username })
      })
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
              <Header>{I18n.get('Reset your password')}</Header>
              <Message warning>{I18n.get(this.state.formErrorMessage)}</Message>
              <Form.Input
                label={I18n.get('Enter your email *')}
                type='email'
                name='email'
                onChange={this.handleInputChange}
              />
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
                  <Form.Button type='submit'>
                    {I18n.get('Send Code')}
                  </Form.Button>
                </Grid.Column>
              </Grid>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}
