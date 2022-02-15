import React from 'react'
import { FormattedMessage } from 'react-intl'
import Dialog from './Dialog'
import './WelcomeDialog.scss'

const RateDialog = () => (
  <Dialog>
    {(closeDialog) => (
      <div className="Welcome-dialog">
        <header>
          <h1>
            <FormattedMessage
              id="dialogs.welcome.heading"
              defaultMessage="歡迎來到內政部營建署【道路斷面設計網站】"
            />
          </h1>
        </header>
        <div className="dialog-content">
          <iframe src="/pages/welcome/" />
        </div>
        <button className="dialog-primary-action" onClick={closeDialog}>
          <FormattedMessage id="btn.close" defaultMessage="Close" />
        </button>
      </div>
    )}
  </Dialog>
)

export default RateDialog
