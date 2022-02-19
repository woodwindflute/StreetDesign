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
        <div className="welcome-dialog-content">
          <h2>
            <FormattedMessage
              id="dialogs.welcome.content"
              defaultMessage="在這裡可以自由設計你(妳)心目中理想的道路斷面"
            />
          </h2>
          <h2>
            <FormattedMessage
              id="dialogs.welcome.content"
              defaultMessage="並檢視所設計的道路特色及配置情形"
            />
          </h2>
          <h2>
            <FormattedMessage
              id="dialogs.welcome.content"
              defaultMessage="也可登入帳號以儲存或分享創作的成果哦~"
            />
          </h2>  
        </div>
        <button className="dialog-primary-action" onClick={closeDialog}>
          <FormattedMessage id="btn.close" defaultMessage="Close" />
        </button>
      </div>
    )}
  </Dialog>
)

export default RateDialog
