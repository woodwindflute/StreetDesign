import { segmentsChanged } from '../segments/view'
import store from '../store'
import { updateSettings } from '../store/slices/settings'
import {
  setLastStreet,
  prepare15mStreet,
  prepare20mStreet,
  prepare25mStreet,
  prepare30mStreet,
  prepare40mStreet,
  prepareEmptyStreet,
  setIgnoreStreetChanges
} from './data_model'
import { NEW_STREET_DEFAULT, NEW_STREET_EMPTY } from './constants'
import { saveStreetToServer } from './xhr'

export function makeDefaultStreet (meter) {
  setIgnoreStreetChanges(true)
  switch (meter) {
    case 15:
      prepare15mStreet()
      break
    case 20:
      prepare20mStreet()
      break
    case 25:
      prepare25mStreet()
      break
    case 30:
      prepare30mStreet()
      break
    case 40:
      prepare40mStreet()
      break
  }
  segmentsChanged()

  setIgnoreStreetChanges(false)
  setLastStreet()

  saveStreetToServer(false)
}

export function onNewStreetDefaultClick () {
  store.dispatch(
    updateSettings({
      newStreetPreference: NEW_STREET_DEFAULT
    })
  )

  makeDefaultStreet(15)
}

export function onNewStreet20mClick () {
  store.dispatch(
    updateSettings({
      newStreetPreference: NEW_STREET_DEFAULT
    })
  )

  makeDefaultStreet(20)
}

export function onNewStreet25mClick () {
  store.dispatch(
    updateSettings({
      newStreetPreference: NEW_STREET_DEFAULT
    })
  )

  makeDefaultStreet(25)
}

export function onNewStreet30mClick () {
  store.dispatch(
    updateSettings({
      newStreetPreference: NEW_STREET_DEFAULT
    })
  )

  makeDefaultStreet(30)
}

export function onNewStreet40mClick () {
  store.dispatch(
    updateSettings({
      newStreetPreference: NEW_STREET_DEFAULT
    })
  )

  makeDefaultStreet(40)
}

export function onNewStreetEmptyClick () {
  store.dispatch(
    updateSettings({
      newStreetPreference: NEW_STREET_EMPTY
    })
  )

  setIgnoreStreetChanges(true)
  prepareEmptyStreet()

  segmentsChanged()

  setIgnoreStreetChanges(false)
  setLastStreet()

  saveStreetToServer(false)
}
