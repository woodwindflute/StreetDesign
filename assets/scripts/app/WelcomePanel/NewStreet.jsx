import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { NEW_STREET_DEFAULT, NEW_STREET_EMPTY } from '../../streets/constants'
import {
  onNewStreetDefaultClick,
  onNewStreet20mClick,
  onNewStreet25mClick,
  onNewStreet30mClick,
  onNewStreet40mClick,
  onNewStreetEmptyClick
} from '../../streets/creation'
import { getLastStreet } from '../../store/actions/street'

function NewStreet (props) {
  const newStreetPreference = useSelector(
    (state) => state.settings.newStreetPreference
  )
  const priorLastStreetId = useSelector((state) => state.app.priorLastStreetId)
  const street = useSelector((state) => state.street)
  const dispatch = useDispatch()

  // If welcomeType is WELCOME_NEW_STREET, there is an additional state
  // property that determines which of the new street modes is selected
  let selectedNewStreetType
  switch (newStreetPreference) {
    case NEW_STREET_EMPTY:
      selectedNewStreetType = 'new-street-empty'
      break
    case NEW_STREET_DEFAULT:
    default:
      selectedNewStreetType = 'new-street-default'
      break
  }

  const [state, setState] = useState({ selectedNewStreetType })

  // Handles changing the "checked" state of the input buttons.
  function handleChangeNewStreetType (event) {
    setState({
      selectedNewStreetType: event.target.id
    })
  }

  function handleGetLastStreet (event) {
    dispatch(getLastStreet())
  }

  return (
    <div className="welcome-panel-content new-street">
      <h1>
        <FormattedMessage
          id="dialogs.new-street.heading"
          defaultMessage="Here’s your new street."
        />
      </h1>
      <ul>
        <li>
          <input
            type="radio"
            name="new-street"
            id="new-street-15m"
            checked={
              state.selectedNewStreetType === 'new-street-15m' ||
              !state.selectedNewStreetType
            }
            onChange={handleChangeNewStreetType}
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
            checked={state.selectedNewStreetType === 'new-street-20m'}
            onChange={handleChangeNewStreetType}
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
            checked={state.selectedNewStreetType === 'new-street-25m'}
            onChange={handleChangeNewStreetType}
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
            checked={state.selectedNewStreetType === 'new-street-30m'}
            onChange={handleChangeNewStreetType}
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
            checked={state.selectedNewStreetType === 'new-street-40m'}
            onChange={handleChangeNewStreetType}
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
            checked={state.selectedNewStreetType === 'new-street-empty'}
            onChange={handleChangeNewStreetType}
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
    </div>
  )
}

export default NewStreet
