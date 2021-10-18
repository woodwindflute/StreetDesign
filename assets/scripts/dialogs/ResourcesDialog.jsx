import React from 'react'
import { FormattedMessage } from 'react-intl'
import Dialog from './Dialog'

const RateDialog = () => (
  <Dialog>
    {(closeDialog) => (
      <div className="resources-dialog">
        <header>
          <h1>
            <FormattedMessage
              id="dialogs.resources.heading"
              defaultMessage="使用資源"
            />
          </h1>
        </header>
        <div className="dialog-content">
          <iframe src="/pages/resources/" />
        </div>
        <button className="dialog-primary-action" onClick={closeDialog}>
          <FormattedMessage id="btn.close" defaultMessage="Close" />
        </button>
      </div>
    )}
  </Dialog>
)

export default RateDialog
