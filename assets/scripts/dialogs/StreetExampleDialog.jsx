import React from 'react'
import Dialog from './Dialog'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import {
  onNewStreet20mClick,
  onNewStreet25mClick,
  onNewStreet30mClick,
  onNewStreet40mClick,
  onNewStreetDefaultClick,
  onNewStreetEmptyClick
} from '../streets/creation'
import './StreetExampleDialog.scss'

const StreetExampleDialog = () => {
  const newStreetPreference = useSelector(
    (state) => state.settings.newStreetPreference
  )

  return (
    <Dialog>
      {(closeDialog) => (
        <div className="street-example-dialog">
          <header>
            <h1>
              <FormattedMessage
                id="dialogs.new-street.heading"
                defaultMessage="Here's your new street."
              />
            </h1>
          </header>
          <ul>
            <li>
              <input
                type="radio"
                name="new-street"
                id="new-street-15m"
                onClick={onNewStreetDefaultClick}
              />
              <label htmlFor="new-street-15m">
                <FormattedMessage
                  id="dialogs.new-street.15m"
                  defaultMessage="15m"
                />
              </label>
            </li>
            <li>
              <input
                type="radio"
                name="new-street"
                id="new-street-20m"
                onClick={onNewStreet20mClick}
              />
              <label htmlFor="new-street-20m">
                <FormattedMessage
                  id="dialogs.new-street.20m"
                  defaultMessage="20m"
                />
              </label>
            </li>
            <li>
              <input
                type="radio"
                name="new-street"
                id="new-street-25m"
                onClick={onNewStreet25mClick}
              />
              <label htmlFor="new-street-25m">
                <FormattedMessage
                  id="dialogs.new-street.25m"
                  defaultMessage="25m"
                />
              </label>
            </li>
            <li>
              <input
                type="radio"
                name="new-street"
                id="new-street-30m"
                onClick={onNewStreet30mClick}
              />
              <label htmlFor="new-street-30m">
                <FormattedMessage
                  id="dialogs.new-street.30m"
                  defaultMessage="30m"
                />
              </label>
            </li>
            <li>
              <input
                type="radio"
                name="new-street"
                id="new-street-40m"
                onClick={onNewStreet40mClick}
              />
              <label htmlFor="new-street-40m">
                <FormattedMessage
                  id="dialogs.new-street.40m"
                  defaultMessage="40m"
                />
              </label>
            </li>
            <li>
              <input
                type="radio"
                name="new-street"
                id="new-street-empty"
                onClick={onNewStreetEmptyClick}
              />
              <label htmlFor="new-street-empty">
                <FormattedMessage
                  id="dialogs.new-street.empty"
                  defaultMessage="Start with an empty street"
                />
              </label>
            </li>
          </ul>
          <button className="dialog-primary-action" onClick={closeDialog}>
            <FormattedMessage id="btn.close" defaultMessage="Close" />
          </button>
        </div>
      )}
    </Dialog>
  )
}

export default StreetExampleDialog