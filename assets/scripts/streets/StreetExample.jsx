import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { showDialog } from '../store/slices/dialogs'
import { isOwnedByCurrentUser } from './owner'
import './StreetExample.scss'

const StreetExample = () => {
  const editable = useSelector((state) => !state.app.readOnly && isOwnedByCurrentUser())
  const dispatch = useDispatch()

  const handleClickStreetExample = (event) => {
    event.preventDefault()
    dispatch(showDialog('STREET_EXAMPLE'))
  }

  return (
    <div className="street-example">
      {editable ? (
        <a onClick={handleClickStreetExample}>
          <FormattedMessage
            id='street.example'
            defaultMessage='Example street'
          />
        </a>
      ) : null}
    </div>
  )
}

export default StreetExample