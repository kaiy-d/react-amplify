import React from 'react'
import { SignUp as AmplifySignUp } from 'aws-amplify-react'
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

export default class SignUp extends AmplifySignUp {
  constructor(props) {
    super(props)

    // This is needed to parse login attempts and to be able to display error message to the user
    Hub.listen('auth', this.onHubCapsule.bind(this))

    this.state = {
      formErrorMessages: [],
      invalidPasswordError: false,
      invalidEmailError: false,
      loading: false,
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onHubCapsule({ channel, payload, source }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, event, message } = payload

    if (channel === 'auth' && event === 'signUp_failure') {
      switch (data.code) {
        case 'UsernameExistsException':
          this.setState({
            invalidEmailError: I18n.get('This email is already in use.'),
            invalidPasswordError: false,
            formErrorMessages: [],
            loading: false,
          })
          break
        case 'InvalidParameterException':
        case 'InvalidPasswordException':
          this.setState({
            invalidPasswordError: I18n.get(
              'The password needs to be at least 8 characters.',
            ),
            invalidEmailError: false,
            formErrorMessages: [],
            loading: false,
          })
          break
        default:
          this.setState({
            formErrorMessages: [I18n.get(message)],
            invalidPasswordError: false,
            invalidEmailError: false,
            loading: false,
          })
      }
    }
  }

  onSubmit(event) {
    let errorFieldLabels = this.validate()

    this.setState({
      loading: true,
    })

    /*eslint no-extra-boolean-cast: 0*/
    if (!!errorFieldLabels && errorFieldLabels.length > 0) {
      errorFieldLabels = errorFieldLabels.map(label => {
        return I18n.get(`${label} is required.`)
      })
      this.setState({
        formErrorMessages: errorFieldLabels,
        loading: false,
      })

      return event.preventDefault()
    }

    this.signUp()
  }

  showComponent() {
    if (this.checkCustomSignUpFields()) {
      this.signUpFields = this.props.signUpConfig.signUpFields
    }

    const formErrorMessages = this.state.formErrorMessages.map(
      (errorMessage, index) => {
        return (
          <Message warning key={`formError-${index}`}>
            {errorMessage}
          </Message>
        )
      },
    )
    return (
      <Grid centered columns={1}>
        <Grid.Column mobile={16} tablet={10} computer={6}>
          <Segment>
            <Dimmer active={this.state.loading} inverted>
              <Loader inverted />
            </Dimmer>
            <Form
              onSubmit={this.onSubmit.bind(this)}
              warning={!!this.state.formErrorMessages}
            >
              <Header>{I18n.get('Create a new account')}</Header>
              {formErrorMessages}
              <Form.Input
                error={this.state.invalidEmailError}
                label={I18n.get('Email *')}
                placeholder={I18n.get('Enter your email')}
                type='email'
                name='email'
                onChange={this.handleInputChange}
              />
              <Form.Input
                error={this.state.invalidPasswordError}
                label={I18n.get('Password *')}
                placeholder={I18n.get('Enter your password')}
                type='password'
                name='password'
                onChange={this.handleInputChange}
              />
              <Form.Input
                label={I18n.get('Name *')}
                placeholder={I18n.get('Enter your name')}
                type='text'
                name='name'
                onChange={this.handleInputChange}
              />
              <Form.Input
                label={I18n.get('Website *')}
                placeholder={I18n.get('Enter your website')}
                type='text'
                name='website'
                onChange={this.handleInputChange}
              />
              <Grid columns={2}>
                <Grid.Column verticalAlign='bottom' textAlign='left'>
                  <List>
                    <List.Item
                      as='a'
                      onClick={() => this.changeState('signIn')}
                    >
                      {I18n.get('Sign in')}
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column textAlign='right'>
                  <Form.Button type='submit'>{I18n.get('Sign Up')}</Form.Button>
                </Grid.Column>
              </Grid>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}
