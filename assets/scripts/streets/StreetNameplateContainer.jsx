import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import { saveStreetName } from '../store/slices/street'
import StreetName from './StreetName'
import StreetMeta from './StreetMeta'
import StreetExample from './StreetExample'
import './StreetNameplateContainer.scss'


function StreetNameplateContainer(props) {
  const isVisible = useSelector((state) => !state.ui.welcomePanelVisible)
  const isEditable = useSelector(
    (state) => !state.app.readOnly && state.flags.EDIT_STREET_NAME.value
  )
  const isGuideEnd = useSelector((state) => state.ui.guideEnd)
  const streetName = useSelector((state) => state.street.name)
  const dispatch = useDispatch()
  const intl = useIntl()
  const streetNameEl = useRef(null)
  const lastSentCoords = useRef(null)
  const [rightMenuBarLeftPos, setRightMenuBarLeftPos] = useState(0)
  const [streetNameCoords, setStreetNameCoords] = useState({
    left: 0,
    width: 0
  })

  useEffect(() => {
    window.addEventListener('resize', updateCoords)
    window.addEventListener('stmx:menu_bar_resized', updatePositions)
    window.dispatchEvent(new CustomEvent('stmx:streetnameplate_mounted'))
    return () => {
      window.removeEventListener('resize', updateCoords)
      window.removeEventListener('stmx:menu_bar_resized', updatePositions)
    }
  })

  const updateCoords = useCallback(() => {
    const rect = streetNameEl.current.getBoundingClientRect()
    const coords = {
      left: rect.left,
      width: rect.width
    }

    if (
      !lastSentCoords.current ||
      coords.left !== lastSentCoords.current.left ||
      coords.width !== lastSentCoords.current.width
    ) {
      lastSentCoords.current = coords
      handleResizeStreetName(coords)
    }
  }, [])

  // Only update coords when something affects the size of the nameplate,
  // prevents excessive cascading renders
  useEffect(() => {
    updateCoords()
  }, [streetName, updateCoords])

  function handleResizeStreetName(coords) {
    setStreetNameCoords({
      left: coords.left,
      width: coords.width
    })
  }

  function updatePositions(event) {
    if (event.detail && event.detail.rightMenuBarLeftPos) {
      setRightMenuBarLeftPos(event.detail.rightMenuBarLeftPos)
    }
  }

  function determineClassNames() {
    const classNames = ['street-nameplate-container']

    if (streetNameCoords.left + streetNameCoords.width > rightMenuBarLeftPos) {
      classNames.push('move-down-for-menu')
    }

    // <StreetNameplateContainer /> might stick out from underneath the
    // <WelcomePanel /> when it's visible. We've checked the store to see if
    // the panel is visible, and if so, this component is not. In this case,
    // momentarily keep the UI clean by hiding it until the panel goes away.
    if (!isVisible && isGuideEnd) {
      classNames.push('hidden')
    }

    return classNames
  }

  function handleClickStreetName() {
    if (!isEditable) return

    const newName = window.prompt(
      intl.formatMessage({
        id: 'prompt.new-street',
        defaultMessage: 'New street name:'
      }),
      streetName ||
      intl.formatMessage({
        id: 'street.default-name',
        defaultMessage: 'Unnamed St'
      })
    )

    if (newName) {
      dispatch(saveStreetName(newName, true))
    }
  }

  return (
    <div className={determineClassNames().join(' ')}>
      <StreetName
        editable={isEditable}
        childRef={streetNameEl}
        name={streetName}
        onClick={handleClickStreetName}
      />
      <StreetMeta />
      <StreetExample />
    </div>
  )
}

export default StreetNameplateContainer
