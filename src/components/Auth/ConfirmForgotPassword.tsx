import React from 'react'
import { ForgotPassword } from 'aws-amplify-react'
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

export default class ConfirmForgotPassword extends ForgotPassword {
  constructor(props) {
    super(props)

    this._validAuthStates = ['confirmForgotPassword']

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

    const { code, password } = this.inputs
    const username = this.props.authData.username

    Auth.forgotPasswordSubmit(username, code, password)
      .then(() => {
        Auth.signIn(username, password)
          .then(() => {
            this.setState({
              loading: false,
            })

            this.changeState('signedIn')
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

  onResend() {
    this.setState({
      loading: true,
    })

    Auth.forgotPassword(this.props.authData.username)
      .then(() => {
        this.setState({
          loading: false,
        })
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
              <Grid columns={1}>
                <Grid.Column>
                  <Form.Input
                    label={I18n.get('Code')}
                    type='text'
                    name='code'
                    onChange={this.handleInputChange}
                  />
                  <Form.Input
                    label={I18n.get('New Password')}
                    type='password'
                    name='password'
                    onChange={this.handleInputChange}
                  />
                </Grid.Column>
              </Grid>
              <Grid columns={2}>
                <Grid.Column verticalAlign='bottom' textAlign='left'>
                  <List>
                    <List.Item as='a' onClick={this.onResend.bind(this)}>
                      {I18n.get('Resend code')}
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column textAlign='right'>
                  <Form.Button type='submit'>{I18n.get('Submit')}</Form.Button>
                </Grid.Column>
              </Grid>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}
