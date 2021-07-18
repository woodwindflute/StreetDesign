import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  goEmailSignIn,
  goTwitterSignIn,
  goFacebookSignIn,
  goGoogleSignIn
} from '../app/routing'
import LoadingSpinner from '../ui/LoadingSpinner'
import Icon from '../ui/Icon'
import Dialog from './Dialog'
import './SignInDialog.scss'

export default class SignInDialog extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      emailSent: false,
      sendingEmail: false,
      error: false,
      signingIn: false
    }

    this.emailInputEl = React.createRef()
  }

  componentDidMount = () => {
    this.emailInputEl.current.focus()
  }

  handleChange = (event) => {
    const target = event.target
    const name = target.name
    const value = target.value

    this.setState({
      [name]: value
    })
  }

  handleFacebookSignIn = (event) => {
    event.preventDefault()

    this.setState({
      signingIn: true
    })

    goFacebookSignIn()
  }

  handleGoogleSignIn = (event) => {
    event.preventDefault()

    this.setState({
      signingIn: true
    })

    goGoogleSignIn()
  }

  handleTwitterSignIn = (event) => {
    event.preventDefault()

    this.setState({
      signingIn: true
    })

    goTwitterSignIn()
  }

  handleGoEmailSignIn = (error, res) => {
    if (error) {
      console.error(error)
      return
    }

    this.setState({
      sendingEmail: false,
      emailSent: true,
      // Reset error state
      error: false
    })
  }

  handleEmailResend = (event) => {
    event.preventDefault()

    this.setState({
      emailSent: false
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()

    // Note: we don't validate the input here;
    // we let HTML5 <input type="email" required /> do validation

    goEmailSignIn(this.state.email, this.handleGoEmailSignIn)

    this.setState({
      sendingEmail: true
    })
  }

  renderErrorMessage = () => {
    return (
      <p className="sign-in-error-message">
        <FormattedMessage
          id="dialogs.sign-in.email-invalid"
          defaultMessage="這不是正確的電子信箱！請再試一次。"
        />
      </p>
    )
  }

  renderSignInWaiting = () => {
    return (
      <Dialog>
        {() => (
          <div className="sign-in-dialog">
            <header>
              <h1 className="sign-in-loading-message">
                <FormattedMessage
                  id="dialogs.sign-in.loading-message"
                  defaultMessage="登入中..."
                />
              </h1>
            </header>
            <div
              className="dialog-content sign-in-loading"
              aria-live="polite"
              aria-busy="true"
            >
              <LoadingSpinner />
            </div>
          </div>
        )}
      </Dialog>
    )
  }

  renderEmailSent = () => {
    return (
      <Dialog>
        {() => (
          <div className="sign-in-dialog">
            <header>
              <h1 className="sign-in-loading-message">
                <FormattedMessage
                  id="dialogs.sign-in.loading-message"
                  defaultMessage="登入中..."
                />
              </h1>
            </header>
            <div className="dialog-content sign-in-email-sent">
              <p>
                <FormattedMessage
                  id="dialogs.sign-in.sent-message-with-email"
                  defaultMessage="我們已經將信寄至 {email}，請根據操作指示登入。"
                  values={{
                    email: (
                      <span className="sign-in-email">{this.state.email}</span>
                    )
                  }}
                />
              </p>
              <p className="sign-in-resend">
                <FormattedMessage
                  id="dialogs.sign-in.email-unreceived"
                  defaultMessage="沒有收到嗎？"
                />
                <br />
                <a onClick={this.handleEmailResend}>
                  <FormattedMessage
                    id="dialogs.sign-in.resend-email"
                    defaultMessage="再寄一次"
                  />
                </a>
              </p>
            </div>
          </div>
        )}
      </Dialog>
    )
  }

  render () {
    const { sendingEmail, emailSent, signingIn } = this.state

    if (sendingEmail || signingIn) {
      return this.renderSignInWaiting()
    } else if (emailSent) {
      return this.renderEmailSent()
    }

    return (
      <Dialog>
        {(closeDialog) => (
          <div className="sign-in-dialog">
            <header>
              <h1>
                <FormattedMessage
                  id="dialogs.sign-in.heading"
                  defaultMessage="登入/註冊"
                />
              </h1>
            </header>
            <div className="dialog-content">
              <p>
                <FormattedMessage
                  id="dialogs.sign-in.description"
                  defaultMessage="保存你的第一個街道！或登入使用之前的設計。"
                />
              </p>

              <form onSubmit={this.handleSubmit}>
                <label
                  htmlFor="sign-in-email-input"
                  className="sign-in-email-label"
                >
                  <FormattedMessage
                    id="dialogs.sign-in.email-label"
                    defaultMessage="電子郵件"
                  />
                </label>

                <input
                  type="email"
                  id="sign-in-email-input"
                  ref={this.emailInputEl}
                  value={this.state.email}
                  className={
                    'sign-in-input ' +
                    (this.state.error ? 'sign-in-input-error' : '')
                  }
                  name="email"
                  onChange={this.handleChange}
                  placeholder="test@test.com"
                  required={true}
                />

                {this.state.error && this.renderErrorMessage()}

                <p className="sign-in-email-password-note">
                  <small>
                    <FormattedMessage
                      id="dialogs.sign-in.email-description"
                      defaultMessage="將會傳送登入網址給您，無須密碼。"
                    />
                  </small>
                </p>

                <button
                  type="submit"
                  className="button-primary sign-in-button sign-in-email-button"
                >
                  <FormattedMessage
                    id="dialogs.sign-in.button.email"
                    defaultMessage="使用Email登入/註冊"
                  />
                </button>
              </form>

              <div className="sign-in-social-heading">
                <hr />
                <span>
                  <FormattedMessage
                    id="dialogs.sign-in.social-heading"
                    defaultMessage="或"
                  />
                </span>
              </div>

              <button
                className="button-tertiary sign-in-button sign-in-social-button sign-in-google-button"
                onClick={this.handleGoogleSignIn}
              >
                <Icon icon="google" />
                <FormattedMessage
                  id="dialogs.sign-in.button.google"
                  defaultMessage="使用Google登入/註冊"
                />
              </button>

              <button
                className="button-tertiary sign-in-button sign-in-social-button sign-in-facebook-button"
                onClick={this.handleFacebookSignIn}
              >
                <Icon icon="facebook" />
                <FormattedMessage
                  id="dialogs.sign-in.button.facebook"
                  defaultMessage="使用Facebook登入/註冊"
                />
              </button>
            </div>

            <footer>
              <p className="sign-in-disclaimer">
                <FormattedMessage
                  id="dialogs.sign-in.tos"
                  defaultMessage="使用此服務即接受我們的 {tosLink} 及 {privacyLink}"
                  values={{
                    tosLink: (
                      <a href="/terms-of-service" target="_blank">
                        <FormattedMessage
                          id="dialogs.sign-in.tos-link-label"
                          defaultMessage="服務條款"
                        />
                      </a>
                    ),
                    privacyLink: (
                      <a href="/privacy-policy" target="_blank">
                        <FormattedMessage
                          id="dialogs.sign-in.privacy-link-label"
                          defaultMessage="隱私權政策"
                        />
                      </a>
                    )
                  }}
                />
              </p>
            </footer>
          </div>
        )}
      </Dialog>
    )
  }
}
