import React from 'react'
import { FormattedMessage } from 'react-intl'
import Dialog from './Dialog'
import './PlanViewDialog.scss'

const PlanViewDialog = () => (
  <Dialog>
    {(closeDialog) => (
      <div className="plan-view-dialog">
        <header>
          <h1>
            <FormattedMessage id="dialogs.whatsnew.heading" defaultMessage="平面圖" />
          </h1>
        </header>
        <div className="dialog-content dialog-content-bleed">
          <iframe src="/pages/plan-view/" />
        </div>
        <button className="dialog-primary-action" onClick={closeDialog}>
          <FormattedMessage id="btn.close" defaultMessage="Close" />
        </button>
      </div>
    )}
  </Dialog>
)

export default PlanViewDialog
