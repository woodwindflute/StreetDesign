import { nanoid } from 'nanoid'
import cloneDeep from 'lodash/cloneDeep'
import { DEFAULT_SEGMENTS } from '../segments/default'
import {
  normalizeSegmentWidth,
  resolutionForResizeType,
  RESIZE_TYPE_INITIAL
} from '../segments/resizing'
import { getVariantString, getVariantArray } from '../segments/variant_utils'
import { segmentsChanged } from '../segments/view'
import { getSignInData, isSignedIn } from '../users/authentication'
import { getLeftHandTraffic } from '../users/localization'
import {
  setUpdateTime,
  saveCreatorId,
  updateStreetData,
  updateEditCount
} from '../store/slices/street'
import { resetUndoStack } from '../store/slices/undo'
import store from '../store'
import { DEFAULT_ENVIRONS } from './constants'
import { createNewUndoIfNecessary, unifyUndoStack } from './undo_stack'
import { normalizeStreetWidth } from './width'
import { updateLastStreetInfo, scheduleSavingStreetToServer } from './xhr'

const DEFAULT_BUILDING_HEIGHT_LEFT = 4
const DEFAULT_BUILDING_HEIGHT_RIGHT = 3
const DEFAULT_BUILDING_VARIANT_LEFT = 'narrow'
const DEFAULT_BUILDING_VARIANT_RIGHT = 'wide'
const DEFAULT_BUILDING_HEIGHT_EMPTY = 1
const DEFAULT_BUILDING_VARIANT_EMPTY = 'grass'
const DEFAULT_STREET_WIDTH = 80

let _lastStreet

export function setLastStreet () {
  _lastStreet = trimStreetData(store.getState().street)
}

const LATEST_SCHEMA_VERSION = 25
// 1: starting point
// 2: adding leftBuildingHeight and rightBuildingHeight
// 3: adding leftBuildingVariant and rightBuildingVariant
// 4: adding transit shelter elevation
// 5: adding another lamp type (traditional)
// 6: colored streetcar lanes
// 7: colored bus and light rail lanes
// 8: colored bike lane
// 9: second car type: truck
// 10: sidewalk density
// 11: unify median and planting strip into divider
// 12: getting rid of small tree
// 13: bike rack elevation
// 14: wayfinding has three types
// 15: sidewalks have rand seed
// 16: stop saving undo stack
// 17: alternative colors for bike lanes
// 18: change lat/lng format from array to object
// 19: add environment
// 20: add sidewalk-level bike lanes
// 21: add sidewalk-level bikeshare docks
// 22: add random seed to drive lanes for pedestrians
// 23: add unique id to each segment
// 24: remove random seed from any segment
// 25: add bus type

function incrementSchemaVersion (street) {
  let segment, variant

  if (!street.schemaVersion) {
    // Fix a bug in 2018 where a street does not have a schema version when it should.
    if (
      (street.createdAt && street.createdAt.indexOf('2018') === 0) ||
      (street.updatedAt && street.updatedAt.indexOf('2018') === 0)
    ) {
      street.schemaVersion = 17
    } else {
      street.schemaVersion = 1
    }
  }

  switch (street.schemaVersion) {
    case 1:
      street.leftBuildingHeight = DEFAULT_BUILDING_HEIGHT_LEFT
      street.rightBuildingHeight = DEFAULT_BUILDING_HEIGHT_RIGHT
      break
    case 2:
      street.leftBuildingVariant = DEFAULT_BUILDING_VARIANT_LEFT
      street.rightBuildingVariant = DEFAULT_BUILDING_VARIANT_RIGHT
      break
    case 3:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'transit-shelter') {
          variant = getVariantArray(segment.type, segment.variantString)
          variant['transit-shelter-elevation'] = 'street-level'
          segment.variantString = getVariantString(variant)
        }
      }
      break
    case 4:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'sidewalk-lamp') {
          variant = getVariantArray(segment.type, segment.variantString)
          variant['lamp-type'] = 'modern'
          segment.variantString = getVariantString(variant)
        }
      }
      break
    case 5:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'streetcar') {
          variant = getVariantArray(segment.type, segment.variantString)
          variant['public-transit-asphalt'] = 'regular'
          segment.variantString = getVariantString(variant)
        }
      }
      break
    case 6:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'bus-lane') {
          variant = getVariantArray(segment.type, segment.variantString)
          variant['bus-asphalt'] = 'regular'
          segment.variantString = getVariantString(variant)
        } else if (segment.type === 'light-rail') {
          variant = getVariantArray(segment.type, segment.variantString)
          variant['public-transit-asphalt'] = 'regular'
          segment.variantString = getVariantString(variant)
        }
      }
      break
    case 7:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'bike-lane') {
          variant = getVariantArray(segment.type, segment.variantString)
          variant['bike-asphalt'] = 'regular'
          segment.variantString = getVariantString(variant)
        }
      }
      break
    case 8:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'drive-lane') {
          variant = getVariantArray(segment.type, segment.variantString)
          variant['car-type'] = 'car'
          segment.variantString = getVariantString(variant)
        }
      }
      break
    case 9:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'sidewalk') {
          variant = getVariantArray(segment.type, segment.variantString)
          variant['sidewalk-density'] = 'normal'
          segment.variantString = getVariantString(variant)
        }
      }
      break
    case 10:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'planting-strip') {
          segment.type = 'divider'

          if (segment.variantString === '') {
            segment.variantString = 'planting-strip'
          }
        } else if (segment.type === 'small-median') {
          segment.type = 'divider'
          segment.variantString = 'median'
        }
      }
      break
    case 11:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'divider') {
          if (segment.variantString === 'small-tree') {
            segment.variantString = 'big-tree'
          }
        } else if (segment.type === 'sidewalk-tree') {
          if (segment.variantString === 'small') {
            segment.variantString = 'big'
          }
        }
      }
      break
    case 12:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'sidewalk-bike-rack') {
          variant = getVariantArray(segment.type, segment.variantString)
          variant['bike-rack-elevation'] = 'sidewalk'
          segment.variantString = getVariantString(variant)
        }
      }
      break
    case 13:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'sidewalk-wayfinding') {
          variant = getVariantArray(segment.type, segment.variantString)
          variant['wayfinding-type'] = 'large'
          segment.variantString = getVariantString(variant)
        }
      }
      break
    case 14:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'sidewalk') {
          // With schema version 24, we no longer need randseeds
          // for segments, so don't bother generating a new one here,
          // just fill this in for placeholder effect
          segment.randSeed = 35
        }
      }
      break
    case 15:
      store.dispatch(resetUndoStack())
      break
    case 16:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'bike-lane') {
          variant = getVariantArray(segment.type, segment.variantString)
          if (variant['bike-asphalt'] === 'colored') {
            variant['bike-asphalt'] = 'green'
          }
          segment.variantString = getVariantString(variant)
        }
      }
      break
    case 17:
      if (street.location && Array.isArray(street.location.latlng)) {
        street.location.latlng = {
          lat: street.location.latlng[0],
          lng: street.location.latlng[1]
        }
      }
      break
    case 18:
      if (!street.environment) {
        street.environment = DEFAULT_ENVIRONS
      }
      break
    case 19:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'bike-lane') {
          variant = getVariantArray(segment.type, segment.variantString)
          variant.elevation = 'road'
          segment.variantString = getVariantString(variant)
        }
      }
      break
    case 20:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'bikeshare') {
          variant = getVariantArray(segment.type, segment.variantString)
          variant.elevation = 'road'
          segment.variantString = getVariantString(variant)
        }
      }
      break
    case 21:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'drive-lane') {
          // With schema version 24, we no longer need randseeds
          // for segments, so don't bother generating a new one here,
          // just fill this in for placeholder effect
          segment.randSeed = 36
        }
      }
      break
    case 22:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (!segment.id) {
          segment.id = nanoid()
        }
      }
      break
    case 23:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.randSeed) {
          delete segment.randSeed
        }
      }
      break
    case 24:
      for (const i in street.segments) {
        segment = street.segments[i]
        if (segment.type === 'bus-lane') {
          variant = getVariantArray(segment.type, segment.variantString)
          variant['bus-type'] = 'typical'
          segment.variantString = getVariantString(variant)
        }
      }
      break
  }

  street.schemaVersion++
  return street
}

/**
 * This function mutates the original street object in place and then returns
 * a boolean for whether it has been updated to the lastest schema version.
 *
 * @todo We should change this behavior (it's weird)
 *
 * @param {Object} street
 */
export function updateToLatestSchemaVersion (street) {
  let updated = false
  while (
    !street.schemaVersion ||
    street.schemaVersion < LATEST_SCHEMA_VERSION
  ) {
    street = incrementSchemaVersion(street)
    updated = true
  }

  // Do some work to update segment data, although they're not technically
  // part of the schema (yet?)
  street.segments = street.segments.map((segment) => {
    // Alternate method of storing variants as object key-value pairs,
    // instead of a string. We might gradually migrate toward this.
    segment.variant = getVariantArray(segment.type, segment.variantString)

    return segment
  })

  return updated
}

export function setStreetCreatorId (newId) {
  store.dispatch(saveCreatorId(newId))

  unifyUndoStack()
  updateLastStreetInfo()
}

export function setUpdateTimeToNow () {
  const updateTime = new Date().toISOString()
  store.dispatch(setUpdateTime(updateTime))
  unifyUndoStack()
}

let ignoreStreetChanges = false

export function setIgnoreStreetChanges (value) {
  ignoreStreetChanges = value
}

export function saveStreetToServerIfNecessary () {
  if (ignoreStreetChanges || store.getState().errors.abortEverything) {
    return
  }

  const street = store.getState().street
  const currentData = trimStreetData(street)

  if (JSON.stringify(currentData) !== JSON.stringify(_lastStreet)) {
    if (street.editCount !== null) {
      store.dispatch(updateEditCount(street.editCount + 1))
    }
    setUpdateTimeToNow()

    // Some parts of the UI need to know this happened to respond to it
    // TODO: figure out appropriate event name
    window.dispatchEvent(new window.CustomEvent('stmx:save_street'))

    createNewUndoIfNecessary(_lastStreet, currentData)

    scheduleSavingStreetToServer()

    _lastStreet = currentData
  }
}

// Copies only the data necessary for save/undo.
export function trimStreetData (street) {
  const newData = {
    schemaVersion: street.schemaVersion,
    showAnalytics: street.showAnalytics,
    capacitySource: street.capacitySource,
    width: street.width,
    name: street.name,
    id: street.id,
    namespacedId: street.namespacedId,
    creatorId: street.creatorId,
    originalStreetId: street.originalStreetId,
    units: street.units,
    location: street.location,
    userUpdated: street.userUpdated,
    environment: street.environment,
    leftBuildingHeight: street.leftBuildingHeight,
    rightBuildingHeight: street.rightBuildingHeight,
    leftBuildingVariant: street.leftBuildingVariant,
    rightBuildingVariant: street.rightBuildingVariant,
    segments: street.segments.map((origSegment) => {
      const segment = {
        id: origSegment.id,
        type: origSegment.type,
        variantString: origSegment.variantString,
        width: origSegment.width,
        label: origSegment.label
      }

      return segment
    })
  }

  if (street.editCount !== null) {
    newData.editCount = street.editCount
  }

  return newData
}

function fillDefaultSegments (units) {
  const segments = []
  const leftHandTraffic = getLeftHandTraffic()

  for (const i in DEFAULT_SEGMENTS[leftHandTraffic]) {
    const segment = cloneDeep(DEFAULT_SEGMENTS[leftHandTraffic][i])
    segment.id = nanoid()
    segment.warnings = []
    segment.variantString = getVariantString(segment.variant)
    segment.width = normalizeSegmentWidth(
      segment.width,
      resolutionForResizeType(RESIZE_TYPE_INITIAL, units)
    )
    segments.push(segment)
  }

  return segments
}

export function prepareDefaultStreet () {
  const units = store.getState().settings.units
  const currentDate = new Date().toISOString()
  const defaultStreet = {
    units: units,
    location: null,
    name: null,
    showAnalytics: true,
    userUpdated: false,
    editCount: 0,
    width: normalizeStreetWidth(DEFAULT_STREET_WIDTH, units),
    environment: DEFAULT_ENVIRONS,
    leftBuildingHeight: DEFAULT_BUILDING_HEIGHT_LEFT,
    leftBuildingVariant: DEFAULT_BUILDING_VARIANT_LEFT,
    rightBuildingHeight: DEFAULT_BUILDING_HEIGHT_RIGHT,
    rightBuildingVariant: DEFAULT_BUILDING_VARIANT_RIGHT,
    schemaVersion: LATEST_SCHEMA_VERSION,
    segments: fillDefaultSegments(units),
    updatedAt: currentDate,
    clientUpdatedAt: currentDate,
    creatorId: (isSignedIn() && getSignInData().userId) || null
  }

  store.dispatch(updateStreetData(defaultStreet))

  if (isSignedIn()) {
    updateLastStreetInfo()
  }
}

export function prepare15mStreet () {
  const units = store.getState().settings.units
  const currentDate = new Date().toISOString()
  const defaultStreet = {
    units: units,
    location: null,
    name: null,
    showAnalytics: true,
    userUpdated: false,
    editCount: 0,
    width: 50,
    environment: DEFAULT_ENVIRONS,
    leftBuildingHeight: 1,
    leftBuildingVariant: 'grass',
    rightBuildingHeight: 1,
    rightBuildingVariant: 'grass',
    schemaVersion: LATEST_SCHEMA_VERSION,
    segments: [
      {
        id: 'hIOgSyH3Vs6paiLDpJ3CZ',
        type: 'sidewalk',
        variantString: 'normal',
        width: 10
      },
      {
        id: 'ZsoG-iGzb0EsuG4W_DIIi',
        type: 'drive-lane',
        variantString: 'inbound|sharrow',
        width: 15
      },
      {
        id: 'joTgUym_kRQfqYU6yubGf',
        type: 'drive-lane',
        variantString: 'outbound|sharrow',
        width: 15
      },
      {
        id: '2torFDEa69L7ZantLwxNI',
        type: 'sidewalk',
        variantString: 'normal',
        width: 10
      }
    ],
    updatedAt: currentDate,
    clientUpdatedAt: currentDate,
    creatorId: (isSignedIn() && getSignInData().userId) || null
  }

  store.dispatch(updateStreetData(defaultStreet))

  if (isSignedIn()) {
    updateLastStreetInfo()
  }
}

export function prepare20mStreet () {
  const units = store.getState().settings.units
  const currentDate = new Date().toISOString()
  const defaultStreet = {
    units: units,
    location: null,
    name: null,
    showAnalytics: true,
    userUpdated: false,
    editCount: 0,
    width: 66.6666,
    environment: DEFAULT_ENVIRONS,
    leftBuildingHeight: 1,
    leftBuildingVariant: 'grass',
    rightBuildingHeight: 1,
    rightBuildingVariant: 'grass',
    schemaVersion: LATEST_SCHEMA_VERSION,
    segments: [
      {
        id: 'E7ufFzhQiqFOTZMKLnEKw',
        type: 'sidewalk',
        variantString: 'normal',
        width: 8.33333
      },
      {
        id: '7LhwG4SCX05N-vOCHNpF2',
        type: 'drive-lane',
        variantString: 'inbound|sharrow',
        width: 15
      },
      {
        id: '5sz8uhQBTZHMdxuoLFYhh',
        type: 'turn-lane',
        variantString: 'inbound|left-straight',
        width: 10
      },
      {
        id: 'm4MW-4ckkc2uq1Iia-qH5',
        type: 'turn-lane',
        variantString: 'outbound|left-straight',
        width: 10
      },
      {
        id: 'V6NBjKLJE8BFYMlsbcnB7',
        type: 'drive-lane',
        variantString: 'outbound|sharrow',
        width: 15
      },
      {
        id: 'TztR0m2wyFTJv75ww6sYF',
        type: 'sidewalk',
        variantString: 'normal',
        width: 8.33333
      }
    ],
    updatedAt: currentDate,
    clientUpdatedAt: currentDate,
    creatorId: (isSignedIn() && getSignInData().userId) || null
  }

  store.dispatch(updateStreetData(defaultStreet))

  if (isSignedIn()) {
    updateLastStreetInfo()
  }
}

export function prepare25mStreet () {
  const units = store.getState().settings.units
  const currentDate = new Date().toISOString()
  const defaultStreet = {
    units: units,
    location: null,
    name: null,
    showAnalytics: true,
    userUpdated: false,
    editCount: 0,
    width: 83.3333,
    environment: DEFAULT_ENVIRONS,
    leftBuildingHeight: 1,
    leftBuildingVariant: 'grass',
    rightBuildingHeight: 1,
    rightBuildingVariant: 'grass',
    schemaVersion: LATEST_SCHEMA_VERSION,
    segments: [
      {
        id: 'bvV3VJp9pU0k6Jzeq9Rz3',
        type: 'sidewalk',
        variantString: 'normal',
        width: 6.66667
      },
      {
        id: 'Hf01jC_9xxFjp-TAjOX-y',
        type: 'sidewalk',
        variantString: 'empty',
        width: 5
      },
      {
        id: 'IMyp7iXCj6mF5h46E8PuM',
        type: 'parking-lane',
        variantString: 'inbound|right',
        width: 3.33333
      },
      {
        id: '92-dDK_0ON6EKphPuzHID',
        type: 'drive-lane',
        variantString: 'inbound|car',
        width: 11.66667
      },
      {
        id: 'bRemDAGxGng_G5PrZVpJd',
        type: 'turn-lane',
        variantString: 'inbound|left-straight',
        width: 10
      },
      {
        id: 'zv7WR8lNlIQDDGBvqxiHW',
        type: 'parking-lane',
        variantString: 'inbound|right',
        width: 1.66667
      },
      {
        id: 'V8lVXyDmJJPZLBJuEPFQ1',
        type: 'divider',
        variantString: 'median',
        width: 6.66667
      },
      {
        id: 'V8SFeB2X0riUN09kE6oBg',
        type: 'parking-lane',
        variantString: 'inbound|left',
        width: 1.66667
      },
      {
        id: 'dukEUdDWsXBNzcIRo9E0g',
        type: 'turn-lane',
        variantString: 'outbound|left-straight',
        width: 10
      },
      {
        id: 'W4mAMFGXXTyZtU3VOdoPb',
        type: 'drive-lane',
        variantString: 'outbound|car',
        width: 11.66667
      },
      {
        id: 'V3M5CyAFm_4LzMeUwOjkW',
        type: 'parking-lane',
        variantString: 'inbound|left',
        width: 3.33333
      },
      {
        id: 'fveWV-or6Z_rpdB0dgmyu',
        type: 'sidewalk',
        variantString: 'empty',
        width: 5
      },
      {
        id: 'KVQ8IiLtO1kMlm1Q38f-u',
        type: 'sidewalk',
        variantString: 'normal',
        width: 6.66667
      }
    ],
    updatedAt: currentDate,
    clientUpdatedAt: currentDate,
    creatorId: (isSignedIn() && getSignInData().userId) || null
  }

  store.dispatch(updateStreetData(defaultStreet))

  if (isSignedIn()) {
    updateLastStreetInfo()
  }
}

export function prepare30mStreet () {
  const units = store.getState().settings.units
  const currentDate = new Date().toISOString()
  const defaultStreet = {
    units: units,
    location: null,
    name: null,
    showAnalytics: true,
    userUpdated: false,
    editCount: 0,
    width: 100,
    environment: DEFAULT_ENVIRONS,
    leftBuildingHeight: 1,
    leftBuildingVariant: 'grass',
    rightBuildingHeight: 1,
    rightBuildingVariant: 'grass',
    schemaVersion: LATEST_SCHEMA_VERSION,
    segments: [
      {
        id: 'PRVwYIFb9Bh1mJ04BIqJC',
        type: 'sidewalk',
        variantString: 'normal',
        width: 8.33333
      },
      {
        id: 'JfxL7n-x2abz0UqaJSLsO',
        type: 'bike-lane',
        variantString: 'inbound|regular|road',
        width: 5
      },
      {
        id: '9m22Nbh9In457HRP76WoH',
        type: 'sidewalk',
        variantString: 'empty',
        width: 6.66667
      },
      {
        id: 'IMyp7iXCj6mF5h46E8PuM',
        type: 'parking-lane',
        variantString: 'inbound|right',
        width: 3.33333
      },
      {
        id: '92-dDK_0ON6EKphPuzHID',
        type: 'drive-lane',
        variantString: 'inbound|car',
        width: 11.66667
      },
      {
        id: 'bRemDAGxGng_G5PrZVpJd',
        type: 'turn-lane',
        variantString: 'inbound|left-straight',
        width: 10
      },
      {
        id: 'zv7WR8lNlIQDDGBvqxiHW',
        type: 'parking-lane',
        variantString: 'inbound|right',
        width: 1.66667
      },
      {
        id: 'V8lVXyDmJJPZLBJuEPFQ1',
        type: 'divider',
        variantString: 'median',
        width: 6.66667
      },
      {
        id: 'V8SFeB2X0riUN09kE6oBg',
        type: 'parking-lane',
        variantString: 'inbound|left',
        width: 1.66667
      },
      {
        id: 'dukEUdDWsXBNzcIRo9E0g',
        type: 'turn-lane',
        variantString: 'outbound|left-straight',
        width: 10
      },
      {
        id: 'W4mAMFGXXTyZtU3VOdoPb',
        type: 'drive-lane',
        variantString: 'outbound|car',
        width: 11.66667
      },
      {
        id: 'V3M5CyAFm_4LzMeUwOjkW',
        type: 'parking-lane',
        variantString: 'inbound|left',
        width: 3.33333
      },
      {
        id: '_IleYnJyhMMtHyBDVyN3R',
        type: 'sidewalk',
        variantString: 'empty',
        width: 6.66667
      },
      {
        id: 'QRWR_87jOTSwXzKE0hGfX',
        type: 'bike-lane',
        variantString: 'outbound|regular|road',
        width: 5
      },
      {
        id: 'YIc1dHUL_il47haRsz4Pl',
        type: 'sidewalk',
        variantString: 'normal',
        width: 8.33333
      }
    ],
    updatedAt: currentDate,
    clientUpdatedAt: currentDate,
    creatorId: (isSignedIn() && getSignInData().userId) || null
  }

  store.dispatch(updateStreetData(defaultStreet))

  if (isSignedIn()) {
    updateLastStreetInfo()
  }
}

export function prepare40mStreet () {
  const units = store.getState().settings.units
  const currentDate = new Date().toISOString()
  const defaultStreet = {
    units: units,
    location: null,
    name: null,
    showAnalytics: true,
    userUpdated: false,
    editCount: 0,
    width: 133.3333,
    environment: DEFAULT_ENVIRONS,
    leftBuildingHeight: 1,
    leftBuildingVariant: 'grass',
    rightBuildingHeight: 1,
    rightBuildingVariant: 'grass',
    schemaVersion: LATEST_SCHEMA_VERSION,
    segments: [
      {
        id: 'fCwyqV_FBCyF2jsdK9m2F',
        type: 'sidewalk',
        variantString: 'normal',
        width: 8.33333
      },
      {
        id: '5-CuA9gtNozIpddHmNu5Y',
        type: 'divider',
        variantString: 'median',
        width: 5
      },
      {
        id: 'lbnSqNqq0f8FE4CoHF7lx',
        type: 'bike-lane',
        variantString: 'inbound|regular|road',
        width: 6.66667
      },
      {
        id: 'Cwk_Dx0Xnazfl2fGNJV79',
        type: 'sidewalk',
        variantString: 'empty',
        width: 5
      },
      {
        id: 'W-0HxA3DksFk70Wo9neWD',
        type: 'parking-lane',
        variantString: 'inbound|right',
        width: 3.33333
      },
      {
        id: 'bh6iZ9wiMSqsYkleRaWvu',
        type: 'drive-lane',
        variantString: 'inbound|sharrow',
        width: 11.66667
      },
      {
        id: 'VTB87-3G65vVyhoFF1Jv3',
        type: 'drive-lane',
        variantString: 'inbound|car',
        width: 11.66667
      },
      {
        id: 'RgLUr89YieCenTdTq22Xa',
        type: 'turn-lane',
        variantString: 'inbound|left-straight',
        width: 10
      },
      {
        id: 'WZ51Q8rbUSrujXiKT0R13',
        type: 'parking-lane',
        variantString: 'inbound|right',
        width: 1.66667
      },
      {
        id: '2xExFQLYPNPFf9wRXuh3Q',
        type: 'divider',
        variantString: 'median',
        width: 6.66667
      },
      {
        id: 'A46uQwnbeEm0ByRk35Edn',
        type: 'parking-lane',
        variantString: 'inbound|left',
        width: 1.66667
      },
      {
        id: 'SNzezHg0E7bWayHW8LWPg',
        type: 'turn-lane',
        variantString: 'outbound|left-straight',
        width: 10
      },
      {
        id: 'HNRQuYvX5B5fBYwR4VkXh',
        type: 'drive-lane',
        variantString: 'outbound|car',
        width: 11.66667
      },
      {
        id: 'Tm-iqHVJ3pdjYlbwx8yuE',
        type: 'drive-lane',
        variantString: 'outbound|sharrow',
        width: 11.66667
      },
      {
        id: '9xa_orAK5ZMQFjZLDhDMu',
        type: 'parking-lane',
        variantString: 'inbound|left',
        width: 3.33333
      },
      {
        id: 'ZnoKiallgm6bPMcb6gQ_q',
        type: 'sidewalk',
        variantString: 'empty',
        width: 5
      },
      {
        id: 'jzAdI6o9yv7EcEnIdWdzV',
        type: 'bike-lane',
        variantString: 'outbound|regular|road',
        width: 6.66667
      },
      {
        id: 'VZGFl0sol-ZPaDfMq2WNa',
        type: 'divider',
        variantString: 'median',
        width: 5
      },
      {
        id: 'D5nVNA20Mxr6_mVPyv-R4',
        type: 'sidewalk',
        variantString: 'normal',
        width: 8.33333
      }
    ],
    updatedAt: currentDate,
    clientUpdatedAt: currentDate,
    creatorId: (isSignedIn() && getSignInData().userId) || null
  }

  store.dispatch(updateStreetData(defaultStreet))

  if (isSignedIn()) {
    updateLastStreetInfo()
  }
}

export function prepareEmptyStreet () {
  const units = store.getState().settings.units
  const currentDate = new Date().toISOString()
  const emptyStreet = {
    units: units,
    location: null,
    name: null,
    showAnalytics: true,
    userUpdated: false,
    editCount: 0,
    width: normalizeStreetWidth(DEFAULT_STREET_WIDTH, units),
    environment: DEFAULT_ENVIRONS,
    leftBuildingHeight: DEFAULT_BUILDING_HEIGHT_EMPTY,
    leftBuildingVariant: DEFAULT_BUILDING_VARIANT_EMPTY,
    rightBuildingHeight: DEFAULT_BUILDING_HEIGHT_EMPTY,
    rightBuildingVariant: DEFAULT_BUILDING_VARIANT_EMPTY,
    schemaVersion: LATEST_SCHEMA_VERSION,
    segments: [],
    updatedAt: currentDate,
    clientUpdatedAt: currentDate,
    creatorId: (isSignedIn() && getSignInData().userId) || null
  }

  store.dispatch(updateStreetData(emptyStreet))

  if (isSignedIn()) {
    updateLastStreetInfo()
  }
}

/**
 * @todo: documentation
 *
 * @param {Boolean} dontScroll - document this
 * @param {Boolean} save - if set to `false`, calling this function will not
 *          cause a re-save of street to the server. (e.g. in the case of
 *          live update feature.) Default is `true`.
 */
export function updateEverything (dontScroll, save = true) {
  setIgnoreStreetChanges(true)
  // TODO Verify that we don't need to dispatch an update width event here
  segmentsChanged()
  setIgnoreStreetChanges(false)

  setLastStreet()

  if (save === true) {
    scheduleSavingStreetToServer()
  }
}
