import React from 'react'
import { FormattedMessage } from 'react-intl'
import Dialog from './Dialog'
import './RateDialog.scss'

const RateDialog = () => (
  <Dialog>
    {(closeDialog) => (
      <div className="rate-dialog">
        <header>
          <h1>
            <FormattedMessage
              id="dialogs.rate.heading"
              defaultMessage="人本道路評語機制🏅"
            />
          </h1>
        </header>
        <div className="dialog-content">
          <iframe src="/pages/rate/" />
        </div>
        <button className="dialog-primary-action" onClick={closeDialog}>
          <FormattedMessage id="btn.close" defaultMessage="Close" />
        </button>
      </div>
    )}
  </Dialog>
)

export default RateDialog
