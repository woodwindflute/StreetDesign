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
        <div>
          <h2 className="plan-view-right">{localStorage.getItem('street-name')=='null'?'無名街':localStorage.getItem('street-name')}</h2>
          <h2 className="plan-view-left">{localStorage.getItem('street-name')=='null'?'無名街':localStorage.getItem('street-name')}</h2>
        </div>
        <button className="dialog-primary-action" onClick={closeDialog}>
          <FormattedMessage id="btn.close" defaultMessage="Close" />
        </button>
      </div>
    )}
  </Dialog>
)

export default PlanViewDialog
